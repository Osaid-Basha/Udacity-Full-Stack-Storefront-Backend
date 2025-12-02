'use strict';

exports.up = function (db, callback) {
    db.createTable('products', {
        id: { type: 'int', primaryKey: true, autoIncrement: true },
        name: { type: 'string', length: 255, notNull: true },
        description: { type: 'text' },
        price: { type: 'numeric', notNull: true },
        sku: { type: 'string', length: 100 },
        stock: { type: 'int', notNull: true, defaultValue: 0 },
        image_url: { type: 'text' },
        created_at: { type: 'timestamp', notNull: true, defaultValue: 'now()' },
        updated_at: { type: 'timestamp', notNull: true, defaultValue: 'now()' }
    }, callback);
};

exports.down = function (db, callback) {
    db.dropTable('products', callback);
};
