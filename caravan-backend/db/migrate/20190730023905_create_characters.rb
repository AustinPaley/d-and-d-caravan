class CreateCharacters < ActiveRecord::Migration[5.2]
  def change
    create_table :characters do |t|
      t.string :name
      t.integer :race_id
      t.string :character_image
      t.timestamps
    end
  end
end
