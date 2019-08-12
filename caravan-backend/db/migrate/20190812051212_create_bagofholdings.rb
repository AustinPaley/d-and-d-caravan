class CreateBagofholdings < ActiveRecord::Migration[5.2]
  def change
    create_table :bagofholdings do |t|
      t.string :money
    end
  end
end
