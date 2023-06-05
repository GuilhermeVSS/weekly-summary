const telegramSendMessage = require('../../services/telegram.svr');

const logHelper = require('../helpers/log.helper');

class Log {
    constructor () {
        this.logs = {};
    }

    start = async(flow, key) => {
        this.logs[flow] = {};
        this.logs[flow][key] = []; 
    }

    trace = async(flow, {key, status, name, data}) => {
        if(!this.logs[flow][key]) this.logs[flow][key] = []
        this.logs[flow][key].push({key, status, name, data});
    }

    end = async (flow, key) => {
        const message = await logHelper.formatMessage(flow, this.logs[flow][key]);
        await telegramSendMessage(message);
        this.logs[flow][key] = [];
    }
}

module.exports = new Log();