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
      t.string :type
      t.string :shop
      t.string :armor_category
      t.string :armor_class
      t.timestamps
    end
  end
end
