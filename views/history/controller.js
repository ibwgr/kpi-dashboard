//import {Data as LocalData}  from './data.remote.js'
export default class Controller {

    constructor(view, data, isTest=false) {
        this.erroeMessageForInvalidDates = "Please select a Date!"

        if (isTest === false){
            this.view = view
            this.data = data
            view.registerRefreshHandler((fromDate, toDate)=>{
                return this.getValuesByFromAndToDate(fromDate,toDate)
            })

        } else {
           // this.data = new LocalData
        }

    }



    validateDateAndTime(fromDate, toDate){
        if (    (fromDate === undefined)
            ||  !(fromDate instanceof Date)){
            return false

        } else return !((toDate === undefined)
            || !(toDate instanceof Date));
    }

    async getValuesByFromAndToDate(fromDate, toDate){
        const isValidDateTime = this.validateDateAndTime(fromDate,toDate)
        if (isValidDateTime){

            const allOeeValues = await this.data.getValuesByDates(fromDate.toISOString(),toDate.toISOString())
            const averageOeeValues = {
                oee: 0,
                ava : 0,
                eff:0,
                qua:0
            }

            averageOeeValues.oee = this.calculateAverageOeeValues(allOeeValues.map(values => values.oee))
            averageOeeValues.ava = this.calculateAverageOeeValues(allOeeValues.map(values => values.ava))
            averageOeeValues.eff = this.calculateAverageOeeValues(allOeeValues.map(values => values.eff))
            averageOeeValues.qua = this.calculateAverageOeeValues(allOeeValues.map(values => values.qua))

            this.updateView(averageOeeValues, allOeeValues)

            // return empty string if date and time is valid
            return {
                message: ""
            }

        }else{
            return {
                message: this.erroeMessageForInvalidDates
            }
        }

    }


    updateView(averageOeeValues, oeeArray){
        this.view.updateChart("oee", 0, averageOeeValues.oee)
        this.view.updateChart("ava", 1, averageOeeValues.ava)
        this.view.updateChart("eff", 2, averageOeeValues.eff)
        this.view.updateChart("qua", 3, averageOeeValues.qua)
        this.view.updateTrend((oeeArray.map(values => values.oee)), (oeeArray.map(values => values.ava)), (oeeArray.map(values => values.eff)), (oeeArray.map(values => values.qua)))
    }


    calculateAverageOeeValues(values = []){
        if (values.length > 0 ){
            const summ = values.reduce((summ, currentValue)=> summ + currentValue)
            return ( summ / values.length )
        } else{
            return 0
        }

    }


}
