var amqp = require('amqplib');
var when = require('when');

amqp
    // 连接 RabbitMQ 队列,并返回一个 Promise 对象
    .connect('amqp://127.0.0.1')
    .then(function (conn) {
        // 使用 when() 包装一个 Promise 对象,仍然返回一个 Promise 对象
        return when(conn.createChannel().then(function (ch) {
            var q = 'hello',
                msg = 'Hello World';

            // 通道绑定到 hello 队列,持久化为 false
            var ok = ch.assertQueue(q, {durable: false});

            // 向队列发送Buffer, 内容为 'Hello World'
            return ok.then(function (_qok) {
                ch.sendToQueue(q, new Buffer(msg));
                console.log(" [x] Sent '%s'", msg);
                // 发送完毕,关闭通道
                return ch.close();
            });
            // ensure 类似于 promise.finally
        })).ensure(function () {
            conn.close();
        });
    }).then(null, console.warn);
