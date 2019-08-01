class CreateItems < ActiveRecord::Migration[5.2]
  def change
    create_table :items do |t|
      t.string :name
      t.string :equipment_category
      t.string :weapon_category
      t.string :range
      t.string :cost
      t.string :damage
      t.string :damage_type
      t.string :description
      t.integer :shop_id
      t.string :armor_category
      t.string :armor_class
      t.integer :current_stock
      t.integer :item_level
      t.timestamps
    end
  end
end
