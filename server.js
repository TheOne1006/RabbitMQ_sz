var amqp = require('amqplib');

amqp
    // 连接 RabbitMQ 队列,并返回一个 Promise 对象
    .connect('amqp://127.0.0.1')
    .then(function (conn) {
        // 表示接收 CTRL + C 推出新哈,关闭和 RabbitMQ 的连接
        process.once('SIGINT', function () {
            conn.close();
        });

        return conn
                // conn.createChannel 创建一个通道
                .createChannel().then(function (ch) {
                    // 在通道里监听 hello 队列,并设置 durable 队列持久化为 false, 表示队列保存在内存中,返回一个Promise对象
                    var ok = ch.assertQueue('hello', {durable: false});

                    ok = ok.then(function (_qok) {
                        // 用于通道消费 hello 队列,并写上处理函数, 并返回一个 promise
                        return ch.consume('hello', function (msg) {
                            console.log(" [x] Received '%s' ", msg.content.toString());
                        }, {noAck: true});
                    });

                    // 用于监听设置消费成功后打印一行文本,表示服务器正常工作,等待客户端数据
                    return ok.then(function (_consumeOk) {
                        console.log(' [*] Waiting for message. To exit press CTRL + C');
                    });
                });
    // 操作错误时,打印错误代码
    }).then(null, console.warn);
