# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)


def item_data_process
  all_item_info_hash = {}
  all_item_data = RestClient.get("http://www.dnd5eapi.co/api/equipment")
  all_parsed_item_data = JSON.parse(all_item_data)
  all_parsed_item_data["results"].map do |item_obj|
    item_data = RestClient.get(item_obj["url"])
    parsed_item_data = JSON.parse(item_data)
    all_item_info_hash[item_obj["name"]] = parsed_item_data
  end
  byebug
  all_item_info_hash
end

def race_parsing
  all_race_names_array = []
  all_race_data = RestClient.get("http://www.dnd5eapi.co/api/races")
  all_parsed_race_data = JSON.parse(all_race_data)
  all_parsed_race_data["results"].map do |race_obj|
    all_race_names_array.push(race_obj["name"])
  end
  byebug
end

# item_data_process
race_parsing
