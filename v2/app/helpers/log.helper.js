
const formatMessage = async (flow, logs) => {
    let message = `Log execution of ${flow}\n\n`;
    message += `Key  name  status  data\n\n`;
    logs.map(log=>{
        message += `${log.key} | ${log.name} | ${log.status} | ${JSON.stringify(log.data)}\n\n`;
    })
    return message;
}

module.exports = {
    formatMessage
}