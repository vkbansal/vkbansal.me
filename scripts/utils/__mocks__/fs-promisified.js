export default {
    readFileAsync(file) {
        if (file.match(/\.md$/)) {
            return Promise.resolve('---\n foo: bar');
        }

        if (file.match(/\.js$/)) {
            return Promise.resolve('export const attributes = {foo: "bar"}');
        }

        return Promise.reject('');
    }
};
