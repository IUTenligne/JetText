class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
        t.string   "email",                  limit: 255, default: "",      null: false
        t.string   "encrypted_password",     limit: 255, default: "",      null: false
        t.string   "firstname",              limit: 255, default: "",      null: true
        t.string   "lastname",               limit: 255, default: "",      null: true
        t.string   "reset_password_token",   limit: 255
        t.datetime "reset_password_sent_at"
        t.datetime "remember_created_at"
        t.integer  "sign_in_count",          limit: 4,   default: 0,       null: false
        t.datetime "current_sign_in_at"
        t.datetime "last_sign_in_at"
        t.integer  "current_sign_in_ip",     limit: 4
        t.integer  "last_sign_in_ip",        limit: 4
        t.datetime "created_at",                                           null: false
        t.datetime "updated_at",                                           null: false
        t.string   "provider",               limit: 255, default: "email", null: false
        t.string   "uid",                    limit: 255, default: "",      null: false
        t.string   "authentication_token",   limit: 255
        t.boolean  "validated",              default: false

        t.references :role, index: true, foreign_key: true
    end
  end
end