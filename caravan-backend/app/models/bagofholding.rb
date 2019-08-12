class Bagofholding < ApplicationRecord
  has_many :items
  has_many :spells
end
