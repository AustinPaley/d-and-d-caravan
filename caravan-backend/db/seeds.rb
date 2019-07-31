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
  all_item_info_hash.each do |item_obj|
    gold_guide = {"cp" => 0.01, "sp" => 0.1, "ep" => 0.5, "gp" => 1, "pp" => 10}
    range_info = item_obj[1]["range"].to_s.gsub("=>", " ").gsub(" ", "spacerspacerspacer").gsub(/[^A-Za-z0-9]+/, "").gsub("spacerspacerspacer", " ")

    if (defined?(gold_guide[item_obj[1]["cost"]["unit"]] * item_obj[1]["cost"]["quantity"])).nil?
      cost_info = ""
    else
      cost_info = gold_guide[item_obj[1]["cost"]["unit"]] * item_obj[1]["cost"]["quantity"]
    end

    if (defined?(item_obj[1]["damage"]["dice_count"].to_s + "d" + item_obj[1]["damage"]["dice_value"].to_s)).nil?
      damage_info = ""
    else
      damage_info = item_obj[1]["damage"]["dice_count"].to_s + "d" + item_obj[1]["damage"]["dice_value"].to_s
    end

    if (defined?(item_obj[1]["damage"]["damage_type"]["name"])).nil?
      damage_type = ""
    else
      damage_type = item_obj[1]["damage"]["damage_type"]["name"]
    end

    if (item_obj[1]["armor_category"]).nil?
      armor_category = ""
    else
      armor_category = item_obj[1]["armor_category"]
    end

    if (item_obj[1]["armor_class"]).nil?
      armor_class = ""
    else
      armor_class = item_obj[1]["armor_class"].to_s.gsub("=>", " ").gsub(",", " ").gsub("_", " ").gsub(" ", "spacerspacerspacer").gsub(/[^A-Za-z0-9]+/, "").gsub("spacerspacerspacer", " ")
    end

    if (item_obj[1]["desc"]).nil?
      desc = ""
    else
      desc = item_obj[1]["desc"]
    end

    if (item_obj[1]["weapon_category:"]).nil?
      weapon_category = ""
    else
      weapon_category = item_obj[1]["weapon_category:"]
    end

    # TODO: FILTER OUT THE REST OF GENERAL ITEMS FROM WEAPONS, ADD REST OF FILTERS FOR ARMOR AND GENERAL GOODS
    case
    when (item_obj[1]["name"].include?("bow") == true)
      shop_id = 4
    when (weapon_category != "")
      shop_id = 3
    else
      shop_id = 1
    end

    itemType = Item.create(
      name: item_obj[1]["name"],
      equipment_category: item_obj[1]["equipment_category"],
      weapon_category: weapon_category,
      range: range_info,
      cost: cost_info,
      damage: damage_info,
      damage_type: damage_type,
      description: desc,
      armor_category: armor_category,
      armor_class: armor_class,
      shop_id: shop_id,
      current_stock: 2,
    )
    itemType.save
  end
end

def race_parsing
  all_race_names_array = []
  all_race_data = RestClient.get("http://www.dnd5eapi.co/api/races")
  all_parsed_race_data = JSON.parse(all_race_data)
  all_parsed_race_data["results"].map do |race_obj|
    race_data = RestClient.get(race_obj["url"])
    parsed_race_data = JSON.parse(race_data)
    parsed_race_data["subraces"].map do |subrace_obj|
      all_race_names_array.push(subrace_obj["name"])
    end
    all_race_names_array.push(race_obj["name"])
  end
  all_race_names_array.each do |race|
    raceType = Race.create(
      race: race
    )
    raceType.save
  end
end

def spell_parsing
  all_spell_info_hash = {}
  spells = JSON.parse(File.read(File.join(File.dirname(__FILE__), "../local-data/spells.json")))
  spells.map do |spells_obj|
    spellType = Spell.create(
      name: spells_obj[0],
      casting_time: spells_obj[1]["casting_time"],
      components: spells_obj[1]["components"],
      description: spells_obj[1]["description"],
      duration: spells_obj[1]["duration"],
      level: spells_obj[1]["level"],
      range: spells_obj[1]["range"],
      school: spells_obj[1]["school"],
      shop_id: 2,
    ).save
  end
end

race_parsing
Character.create(name: "Excalibur", race_id: Race.all[12].id)
Character.create(name: "Austin", race_id: Race.all[0].id)
Character.create(name: "Eduardo", race_id: Race.all[2].id)
Character.create(name: "Finnius", race_id: Race.all[5].id)
Shop.create(name: "Troublesome Telekinesis", character_id: 1)
Shop.create(name: "The Whomping Willow", character_id: 2)
Shop.create(name: "Eduardo's Arms", character_id: 3)
Shop.create(name: "The Fickle Fletcher", character_id: 4)
item_data_process
spell_parsing
