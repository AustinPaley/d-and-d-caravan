class CreateShops < ActiveRecord::Migration[5.2]
  def change
    create_table :shops do |t|
      t.string :name
      t.integer :character_id
      t.integer :level
      t.timestamps
    end
  end
end
