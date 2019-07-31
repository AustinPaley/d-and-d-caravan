class CreateSpells < ActiveRecord::Migration[5.2]
  def change
    create_table :spells do |t|
      t.string :name
      t.string :casting_time
      t.string :components
      t.string :description
      t.string :duration
      t.integer :level
      t.string :range
      t.string :school
      t.integer :shop_id
      t.timestamps
    end
  end
end
