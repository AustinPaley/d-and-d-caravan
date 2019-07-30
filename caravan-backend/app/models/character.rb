class Character < ApplicationRecord
  has_one :shop
  belongs_to :race
end
