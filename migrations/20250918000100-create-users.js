'use strict';

exports.up = function (db, callback) {
    db.createTable('users', {
        id: { type: 'int', primaryKey: true, autoIncrement: true },
        first_name: { type: 'string', length: 100, notNull: true },
        last_name: { type: 'string', length: 100 },
        email: { type: 'string', length: 255, notNull: true, unique: true },
        password_hash: { type: 'string', length: 255, notNull: true },
        role: { type: 'string', length: 50, notNull: true, defaultValue: 'customer' },
        created_at: { type: 'timestamp', notNull: true, defaultValue: 'now()' },
        updated_at: { type: 'timestamp', notNull: true, defaultValue: 'now()' }
    }, callback);
};

exports.down = function (db, callback) {
    db.dropTable('users', callback);
};
