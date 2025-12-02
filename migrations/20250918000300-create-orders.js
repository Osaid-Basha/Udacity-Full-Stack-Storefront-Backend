'use strict';

exports.up = function (db, callback) {
    db.createTable('orders', {
        id: { type: 'int', primaryKey: true, autoIncrement: true },
        user_id: { type: 'int', notNull: true },
        status: { type: 'string', length: 30, notNull: true, defaultValue: 'active' },
        total: { type: 'numeric', notNull: true, defaultValue: 0 },
        shipping_address: { type: 'text' },
        created_at: { type: 'timestamp', notNull: true, defaultValue: 'now()' },
        updated_at: { type: 'timestamp', notNull: true, defaultValue: 'now()' }
    }, function (err) {
        if (err) return callback(err);
        db.addForeignKey('orders', 'users', 'orders_user_fk', {
            'user_id': 'id'
        }, { onDelete: 'CASCADE' }, callback);
    });
};

exports.down = function (db, callback) {
    db.dropTable('orders', callback);
};
