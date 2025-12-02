'use strict';

exports.up = function (db, callback) {
    db.createTable('order_items', {
        id: { type: 'int', primaryKey: true, autoIncrement: true },
        order_id: { type: 'int', notNull: true },
        product_id: { type: 'int', notNull: true },
        quantity: { type: 'int', notNull: true, defaultValue: 1 },
        unit_price: { type: 'numeric', notNull: true },
        created_at: { type: 'timestamp', notNull: true, defaultValue: 'now()' }
    }, function (err) {
        if (err) return callback(err);
        db.addForeignKey('order_items', 'orders', 'oi_order_fk', { 'order_id': 'id' }, { onDelete: 'CASCADE' }, function (err2) {
            if (err2) return callback(err2);
            db.addForeignKey('order_items', 'products', 'oi_product_fk', { 'product_id': 'id' }, { onDelete: 'RESTRICT' }, callback);
        });
    });
};

exports.down = function (db, callback) {
    db.dropTable('order_items', callback);
};
