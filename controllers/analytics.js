const moment = require('moment')
const Order = require('../models/Order')
const errorHandler = require('../utils/errorHandler')

module.exports.overview = async function(req, res){
    try {
        
        const allOrders = await Order.find({user: req.user.id}).sort({date: 1})
        const ordersMap = getOrdersMap(allOrders)
        const yesterdaysOrders = ordersMap[moment().add(-1, 'd').format('DD.MM.YYYY')] || []

        //Orders quantity

        const totalOrdersNumber = allOrders.length

        // Yesterdays orders

        const yesterdayOrdersNumber = yesterdaysOrders.length

        // Days quantity

        const daysNumber = Object.keys(ordersMap).length

        // Average orders per day

        const ordersPerDay = (totalOrdersNumber / daysNumber).toFixed(0)

        // % for orders quantity

        const ordersPercent = ((((yesterdayOrdersNumber / ordersPerDay)-1)*100).toFixed(2))

        // Total proceeds

        const totalProceeds = calculatePrice(allOrders)

        // Average proceeds per day

        const proceedsPerDay = totalProceeds / daysNumber

        // Yesterdays proceeds

        const yesterdaysProceeds = calculatePrice(yesterdaysOrders)

        // Proceeds percents

        const proceedsPercent = ((((yesterdaysProceeds / proceedsPerDay)-1)*100).toFixed(2))

        // Proceeds comparsion

        const compareProceeds = (yesterdaysProceeds - proceedsPerDay).toFixed(2)

        // Orders comparsion

        const compareOrders = (yesterdayOrdersNumber - ordersPerDay).toFixed(2)

        res.status(200).json({
            gain: {
                percent: Math.abs(+proceedsPercent),
                compare: Math.abs(+compareProceeds),
                yesterday: +yesterdaysProceeds,
                isHigher: +proceedsPercent > 0
            },
            orders: {
                percent: Math.abs(+ordersPercent),
                compare: Math.abs(+compareOrders),
                yesterday: +yesterdayOrdersNumber,
                isHigher: +ordersPercent > 0
            }
        })

    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.analytics = async function(req, res){
    try {
        const allOrders = await Order.find({user: req.user.id}).sort({date: 1})
        const ordersMap = getOrdersMap(allOrders)
        const average = +(calculatePrice(allOrders)/Object.keys(ordersMap).length).toFixed(2)

        const chart = Object.keys(ordersMap).map(label =>{
            const gain = calculatePrice(ordersMap[label])
            const order = ordersMap[label].length
            return {
                label,
                order,
                gain
            }
        })

        res.status(200).json({
            average,
            chart
        })

    } catch (e) {
        errorHandler(res, e)
    }
}

function getOrdersMap (orders = []){

    const daysOrders = {}

    orders.forEach(order => {

        const date = moment(order.date).format('DD.MM.YYYY')

        if (date === moment().format('DD.MM.YYYY')) {
            return
        } 

        if (!daysOrders[date]) {
            daysOrders[date] = []
        }
        daysOrders[date].push(order)

    })

    return daysOrders

}

function calculatePrice (orders = []){
    return orders.reduce((total, order)=>{
        const orderPrice = order.list.reduce((orderTotal, item)=>{
            return orderTotal += item.cost * item.quantity
        }, 0)
        return total += orderPrice
    }, 0)
}