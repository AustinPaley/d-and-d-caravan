class CreateQuests < ActiveRecord::Migration[5.2]
  def change
    create_table :quests do |t|
      t.string :description
      t.string :title
      t.string :reward
      t.integer :questboard_id
    end
  end
end
