# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160412161613) do

  create_table "blocks", force: :cascade do |t|
    t.string   "name",       limit: 255
    t.text     "content",    limit: 65535
    t.integer  "user_id",    limit: 4
    t.integer  "page_id",    limit: 4
    t.integer  "type_id",    limit: 4
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
  end

  add_index "blocks", ["page_id"], name: "index_blocks_on_page_id", using: :btree
  add_index "blocks", ["type_id"], name: "index_blocks_on_type_id", using: :btree
  add_index "blocks", ["user_id"], name: "index_blocks_on_user_id", using: :btree

  create_table "containers", force: :cascade do |t|
    t.string   "name",       limit: 255
    t.binary   "content",    limit: 16777215
    t.string   "url",        limit: 255
    t.integer  "user_id",    limit: 4
    t.datetime "created_at",                  null: false
    t.datetime "updated_at",                  null: false
  end

  add_index "containers", ["user_id"], name: "index_containers_on_user_id", using: :btree

  create_table "glossaries", force: :cascade do |t|
    t.string   "name",        limit: 255
    t.text     "description", limit: 65535
    t.integer  "user_id",     limit: 4
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
  end

  add_index "glossaries", ["user_id"], name: "index_glossaries_on_user_id", using: :btree

  create_table "glossaries_pages", id: false, force: :cascade do |t|
    t.integer "page_id",     limit: 4, null: false
    t.integer "glossary_id", limit: 4, null: false
  end

  add_index "glossaries_pages", ["glossary_id", "page_id"], name: "index_glossaries_pages_on_glossary_id_and_page_id", using: :btree
  add_index "glossaries_pages", ["page_id", "glossary_id"], name: "index_glossaries_pages_on_page_id_and_glossary_id", using: :btree

  create_table "pages", force: :cascade do |t|
    t.string   "name",         limit: 255
    t.binary   "content",      limit: 16777215
    t.integer  "container_id", limit: 4
    t.integer  "user_id",      limit: 4
    t.datetime "created_at",                    null: false
    t.datetime "updated_at",                    null: false
    t.integer  "weight",       limit: 4
    t.integer  "level",        limit: 4
  end

  add_index "pages", ["container_id"], name: "index_pages_on_container_id", using: :btree
  add_index "pages", ["user_id"], name: "index_pages_on_user_id", using: :btree

  create_table "pages_uploads", id: false, force: :cascade do |t|
    t.integer "page_id",   limit: 4
    t.integer "upload_id", limit: 4
  end

  create_table "pages_variables", id: false, force: :cascade do |t|
    t.integer "page_id",     limit: 4, null: false
    t.integer "variable_id", limit: 4, null: false
  end

  add_index "pages_variables", ["page_id", "variable_id"], name: "index_pages_variables_on_page_id_and_variable_id", using: :btree
  add_index "pages_variables", ["variable_id", "page_id"], name: "index_pages_variables_on_variable_id_and_page_id", using: :btree

  create_table "types", force: :cascade do |t|
    t.string   "name",       limit: 255
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
  end

  create_table "uploads", force: :cascade do |t|
    t.string   "name",              limit: 255
    t.string   "file_file_name",    limit: 255
    t.string   "file_content_type", limit: 255
    t.integer  "file_file_size",    limit: 4
    t.datetime "file_updated_at"
    t.string   "type",              limit: 255
    t.string   "url",               limit: 255
    t.integer  "size",              limit: 4
    t.integer  "user_id",           limit: 4
  end

  add_index "uploads", ["user_id"], name: "index_uploads_on_user_id", using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "email",                  limit: 255, default: "",      null: false
    t.string   "encrypted_password",     limit: 255, default: "",      null: false
    t.string   "firstname",              limit: 255, default: "",      null: false
    t.string   "lastname",               limit: 255, default: "",      null: false
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
  end

  create_table "variables", force: :cascade do |t|
    t.string   "name",       limit: 255
    t.integer  "value",      limit: 4
    t.integer  "user_id",    limit: 4
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
  end

  add_index "variables", ["user_id"], name: "index_variables_on_user_id", using: :btree

  add_foreign_key "blocks", "pages"
  add_foreign_key "blocks", "types"
  add_foreign_key "blocks", "users"
  add_foreign_key "containers", "users"
  add_foreign_key "glossaries", "users"
  add_foreign_key "pages", "containers"
  add_foreign_key "pages", "users"
  add_foreign_key "uploads", "users"
  add_foreign_key "variables", "users"
end
