const leftPad = (value, totalWidth, paddingChar) => {
    const length = totalWidth - value.toString().length + 1;
    return Array(length).join(paddingChar || '0') + value;
};

module.exports = (miliseconds) => {
    const seconds = parseInt((miliseconds / 1000) % 60);
    const minutes = parseInt((miliseconds / 60000) % 60);
    const hours = parseInt((miliseconds / 3600000));
    return `${leftPad(hours, 2)}h:${leftPad(minutes, 2)}m:${leftPad(seconds, 2)}s`
}