function download(path: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(xhr.responseText);
                } else {
                    reject(new Error(`${xhr.status} ${xhr.statusText}`));
                }
            }
        };
        xhr.open("GET", path);
        xhr.send();
    });
}

export { download };
