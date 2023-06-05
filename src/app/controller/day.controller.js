const { Day } = require('../models/day.model');
const moment = require('moment');


class DayController {
    cleanDatabase = async () =>{
        const date = new Date(moment().subtract(9, 'days').format('YYYY/MM/DD'));
        await Day.deleteMany({createdAt:{$lte: date}});
    }
}

module.exports = new DayController();