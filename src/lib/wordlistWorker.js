onmessage = (e) => {
    const filecontent = e.data;
    const words = filecontent.split("\r\n");
    postMessage(words);
};
