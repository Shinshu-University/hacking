export default async function handler(req, res) {
    if (req.method === 'POST') {
        const url = 'https://hackingdemo.microcms.io/api/v1/loginform';
        const headers = {
            'Content-Type': 'application/json',
            'X-MICROCMS-API-KEY': 'bVsOaxRIkuEeMt1kYgEyt6ogJfkpwmIKlkv2'
        };
        let pwd = '';

        async function fetchData() {
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: headers
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                pwd = data.password; // ここを修正
            } catch (error) {
                console.error('Fetch error:', error);
            }
        }

        await fetchData(); // fetchDataの呼び出しをawaitで待つ

        const { input } = req.body;
        if (input === pwd) { // 比較演算子を修正
            res.status(200).end('Authentication success');
        } else {
            res.status(403).end('Authentication failed');
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
