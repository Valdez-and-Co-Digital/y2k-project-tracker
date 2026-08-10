// Google Workspace REST API helper module using standard fetch and OAuth access token

export interface GoogleContact {
  resourceName: string;
  name: string;
  email: string;
  phone?: string;
  photoUrl?: string;
}

export interface GmailMessage {
  id: string;
  threadId: string;
  snippet?: string;
  subject?: string;
  from?: string;
  date?: string;
}

export interface MeetSpace {
  name: string;
  meetingUri: string;
  meetingCode: string;
}

// 1. GOOGLE MEET API
export async function createGoogleMeetSpace(accessToken: string): Promise<MeetSpace> {
  const response = await fetch('https://meet.googleapis.com/v2/spaces', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      config: {
        accessType: 'OPEN',
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Google Meet API Error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  return {
    name: data.name || 'spaces/new',
    meetingUri: data.meetingUri || `https://meet.google.com/${data.meetingCode || 'new'}`,
    meetingCode: data.meetingCode || 'meet-session',
  };
}

// 2. GMAIL API
export async function listGmailMessages(accessToken: string, query: string = 'maxResults=10'): Promise<GmailMessage[]> {
  const response = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages?${query}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gmail API Error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  if (!data.messages || data.messages.length === 0) return [];

  // Fetch details for top messages
  const messagePromises = data.messages.slice(0, 8).map(async (msg: { id: string }) => {
    try {
      const msgRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!msgRes.ok) return null;
      const detail = await msgRes.json();
      
      const headers = detail.payload?.headers || [];
      const getHeader = (name: string) => headers.find((h: { name: string; value: string }) => h.name.toLowerCase() === name.toLowerCase())?.value || '';

      return {
        id: detail.id,
        threadId: detail.threadId,
        snippet: detail.snippet,
        subject: getHeader('Subject') || '(No Subject)',
        from: getHeader('From') || 'Unknown',
        date: getHeader('Date') || '',
      };
    } catch {
      return null;
    }
  });

  const results = await Promise.all(messagePromises);
  return results.filter((m): m is GmailMessage => m !== null);
}

export async function sendGmailMessage(
  accessToken: string, 
  toEmail: string, 
  subject: string, 
  bodyText: string
): Promise<{ id: string }> {
  // Construct raw RFC 2822 email message encoded in base64url
  const emailLines = [
    `To: ${toEmail}`,
    `Subject: ${subject}`,
    `Content-Type: text/plain; charset="UTF-8"`,
    `MIME-Version: 1.0`,
    ``,
    bodyText,
  ];
  const emailString = emailLines.join('\r\n');
  const encodedEmail = btoa(unescape(encodeURIComponent(emailString)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw: encodedEmail }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gmail Send Error (${response.status}): ${errText}`);
  }

  return response.json();
}

// 3. GOOGLE SHEETS API
export async function createAndPopulateGoogleSheet(
  accessToken: string,
  title: string,
  headers: string[],
  rows: (string | number)[][]
): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> {
  // 1. Create spreadsheet
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: { title },
      sheets: [
        {
          properties: {
            title: 'Time & Scope Report',
            gridProperties: { rowCount: rows.length + 10, columnCount: headers.length + 2 },
          },
        },
      ],
    }),
  });

  if (!createRes.ok) {
    const errText = await createRes.text();
    throw new Error(`Google Sheets Create Error (${createRes.status}): ${errText}`);
  }

  const sheetData = await createRes.json();
  const spreadsheetId = sheetData.spreadsheetId;
  const spreadsheetUrl = sheetData.spreadsheetUrl;

  // 2. Append rows
  const valueData = [headers, ...rows];
  const appendRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A1:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: valueData,
      }),
    }
  );

  if (!appendRes.ok) {
    const errText = await appendRes.text();
    throw new Error(`Google Sheets Populate Error (${appendRes.status}): ${errText}`);
  }

  return { spreadsheetId, spreadsheetUrl };
}

// 4. GOOGLE CONTACTS (PEOPLE API)
export async function listGoogleContacts(accessToken: string): Promise<GoogleContact[]> {
  const response = await fetch(
    'https://people.googleapis.com/v1/people/me/connections?personFields=names,emailAddresses,phoneNumbers,photos&pageSize=30',
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Google Contacts Error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  if (!data.connections) return [];

  return data.connections.map((person: any) => {
    const name = person.names?.[0]?.displayName || 'Unnamed Contact';
    const email = person.emailAddresses?.[0]?.value || '';
    const phone = person.phoneNumbers?.[0]?.value || '';
    const photoUrl = person.photos?.[0]?.url || '';

    return {
      resourceName: person.resourceName,
      name,
      email,
      phone,
      photoUrl,
    };
  });
}
