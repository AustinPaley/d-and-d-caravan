class Item < ApplicationRecord
  belongs_to :shop
  belongs_to :bagofholding, optional: true
end
