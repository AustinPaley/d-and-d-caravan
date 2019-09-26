class CreateQuestboard < ActiveRecord::Migration[5.2]
  def change
    create_table :questboards do |t|
      t.string :name
    end
  end
end
