class CreateQuests < ActiveRecord::Migration[5.2]
  def change
    create_table :quests do |t|
      t.string :description
      t.string :title
      t.string :reward
      t.string :suggested_level #this hasn't been added yet - needs migration
      t.integer :questboard_id
    end
  end
end
