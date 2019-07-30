class Shop < ApplicationRecord
  has_many :spells
  has_many :items
  belongs_to :character
end
