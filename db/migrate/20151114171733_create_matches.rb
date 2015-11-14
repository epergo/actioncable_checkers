class CreateMatches < ActiveRecord::Migration
  def change
    create_table :matches do |t|
      t.belongs_to :user
      t.text :board
      t.string :turn

      t.timestamps null: false
    end
  end
end
