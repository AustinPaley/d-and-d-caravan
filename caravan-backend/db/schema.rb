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

ActiveRecord::Schema.define(version: 2019_07_30_024233) do

  create_table "characters", force: :cascade do |t|
    t.string "name"
    t.integer "race_id"
    t.string "character_image"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "items", force: :cascade do |t|
    t.string "name"
    t.string "equipment_category"
    t.string "weapon_category"
    t.string "range"
    t.string "cost"
    t.string "damage"
    t.string "damage_type"
    t.string "description"
    t.integer "shop_id"
    t.string "armor_category"
    t.string "armor_class"
    t.integer "current_stock"
    t.integer "item_level"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "races", force: :cascade do |t|
    t.string "race"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "shops", force: :cascade do |t|
    t.string "name"
    t.integer "character_id"
    t.integer "level"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "spells", force: :cascade do |t|
    t.string "name"
    t.string "casting_time"
    t.string "components"
    t.string "description"
    t.string "duration"
    t.integer "level"
    t.string "range"
    t.string "school"
    t.string "cost"
    t.integer "shop_id"
    t.integer "current_stock"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

end
