def item_data_process
  all_item_info_hash = {}
  all_parsed_item_data = JSON.parse(File.read(File.join(File.dirname(__FILE__), "../local-data/equipment.json")))
  all_parsed_item_data.map do |item_obj|
    all_item_info_hash[item_obj["name"]] = item_obj
  end
  all_item_info_hash.each do |item_obj|
    gold_guide = {"cp" => 0.01, "sp" => 0.1, "ep" => 0.5, "gp" => 1, "pp" => 10}
    range_info = item_obj[1]["range"].to_s.gsub("=>", " ").gsub(" ", "spacerspacerspacer").gsub(/[^A-Za-z0-9]+/, "").gsub("spacerspacerspacer", " ")

# DATA REPURPOSING/CLEANUP BASED ON ITEM TYPE
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

    if (item_obj[1]["weapon_category"]).nil?
      weapon_category = ""
    else
      weapon_category = item_obj[1]["weapon_category"]
    end

    # SHOP FILTERING BASED ON ITEM TYPE
    musical_instruments = ["bagpipes", "lute", "drum", "dulcimer", "flute", "lyre", "horn", "pan flute", "shawm", "viol"]

    case
    when ((item_obj[1]["name"].downcase.include?("bow") == true) || (item_obj[1]["name"].downcase.include?("arrow") == true) || (item_obj[1]["name"].downcase.include?("bolt") == true))
      shop_id = 5
    when (armor_category != "")
      shop_id = 6
    when (weapon_category != "")
      shop_id = 4
    when ((item_obj[1]["name"].downcase.include?("ship") == true) || (item_obj[1]["name"].downcase.include?("boat") == true) || (item_obj[1]["name"].downcase.include?("galley") == true))
      shop_id = 8
    when (item_obj[1]["equipment_category"].include?("Mounts") == true)
      shop_id = 7
    when ((item_obj[1]["name"].downcase.include?("vial") == true) || (item_obj[1]["name"].downcase.include?("flask") == true) || (item_obj[1]["name"].downcase.include?("potion") == true))
      shop_id = 9
    when (musical_instruments.include?(item_obj[1]["name"].downcase) == true)
      shop_id = 10
    else
      shop_id = 3
    end

    # LEVEL ASSIGNMENT BASED ON ITEM COST
    case
    when (cost_info < 10)
      item_level = 1
    when (cost_info >= 10)
      item_level = 2
    when (cost_info >= 50)
      item_level = 3
    when (cost_info >= 100)
      item_level = 4
    when (cost_info >= 200)
      item_level = 5
    when (cost_info >= 500)
      item_level = 6
    when (cost_info >= 1000)
      item_level = 7
    when (cost_info >= 2000)
      item_level = 8
    when (cost_info >= 5000)
      item_level = 9
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
      item_level: item_level
    )
    # This is for testing purposes - just need 10 items in the bag to start
    if (Bagofholding.all[0].items.length < 10)
      itemType.update(bagofholding_id: 1)
    end
    itemType.save
  end
end

def race_parsing
  all_race_names_array = []
  all_parsed_race_data = JSON.parse(File.read(File.join(File.dirname(__FILE__), "../local-data/races.json")))
  all_parsed_race_data.map do |race_obj|
    race_obj["subraces"].map do |subrace_obj|
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
  spellCostKey = {0 => "50", 1 => "100", 2 => "150", 3 => "200", 4 => "250", 5 => "300", 6 => "350", 7 => "400", 8 => "450", 9 => "500"}
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
      cost: spellCostKey[spells_obj[1]["level"]],
      current_stock: 2,
      shop_id: 2
    )
    # Need some spells to test bagofholding - this is for testing purposes
    if (Bagofholding.all[0].spells.length < 10)
      spellType.update(bagofholding_id: 1)
    end
    spellType.save
  end
end

race_parsing
Bagofholding.create(money: "0")
Character.create(name: "Excalibur", race_id: Race.all[12].id, character_image: Base64.encode64(File.read(File.join(File.dirname(__FILE__), "../local-data/character-images/excalibur.png"))))
Character.create(name: "Austin", race_id: Race.all[0].id, character_image: Base64.strict_encode64(File.read(File.join(File.dirname(__FILE__), "../local-data/character-images/austin.png"))))
Character.create(name: "Eduardo", race_id: Race.all[2].id, character_image: Base64.strict_encode64(File.read(File.join(File.dirname(__FILE__), "../local-data/character-images/eduardo.png"))))
Character.create(name: "Finnius", race_id: Race.all[5].id, character_image: Base64.strict_encode64(File.read(File.join(File.dirname(__FILE__), "../local-data/character-images/finnius.png"))))
Character.create(name: "Annabelle", race_id: Race.all[0].id, character_image: Base64.strict_encode64(File.read(File.join(File.dirname(__FILE__), "../local-data/character-images/annabelle.png"))))
Character.create(name: "Mason Maxwell IV", race_id: Race.all[11].id, character_image: Base64.strict_encode64(File.read(File.join(File.dirname(__FILE__), "../local-data/character-images/mason.png"))))
Character.create(name: "Ferrymaster Mack", race_id: Race.all[4].id, character_image: Base64.strict_encode64(File.read(File.join(File.dirname(__FILE__), "../local-data/character-images/mack.png"))))
Character.create(name: "Eevee The Arcane", race_id: Race.all[7].id, character_image: Base64.strict_encode64(File.read(File.join(File.dirname(__FILE__), "../local-data/character-images/eevee.png"))))
Character.create(name: "Kyrene", race_id: Race.all[4].id, character_image: Base64.strict_encode64(File.read(File.join(File.dirname(__FILE__), "../local-data/character-images/kyrene.png"))))
Shop.create(name:"PARTY BAG HOLDER", character_id: 1, level: 0)
Shop.create(name: "Troublesome Telekinesis", character_id: 1, level: 0)
Shop.create(name: "The Whomping Willow", character_id: 2, level: 0)
Shop.create(name: "Eduardo's Arms", character_id: 3, level: 0)
Shop.create(name: "The Fickle Fletcher", character_id: 4, level: 0)
Shop.create(name: "The Gargantuan Girl Forge", character_id: 5, level: 0)
Shop.create(name: "Mason's Magnificant Mounts and Pets", character_id: 6, level: 0)
Shop.create(name: "Boats of Loire", character_id: 7, level: 0)
Shop.create(name: "Versatile Vials", character_id: 8, level: 0)
Shop.create(name: "No Strings Attached", character_id: 9, level: 0)
Questboard.create(name: "default")
Quest.create(title: "Test1", questboard_id: 1, description: "Test1 description", reward: "10")
Quest.create(title: "Test2", questboard_id: 1, description: "Test1 description", reward: "10")
Quest.create(title: "Test3", questboard_id: 1, description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tincidunt lobortis feugiat vivamus at augue eget. Gravida dictum fusce ut placerat orci. Integer enim neque volutpat ac tincidunt vitae semper quis. Nec dui nunc mattis enim. Est ultricies integer quis auctor elit sed. Amet nisl purus in mollis nunc sed. Dignissim diam quis enim lobortis scelerisque fermentum. Cursus eget nunc scelerisque viverra mauris in aliquam. Sodales ut eu sem integer vitae justo. Vivamus arcu felis bibendum ut tristique. Lectus nulla at volutpat diam ut venenatis tellus. Ut sem nulla pharetra diam sit amet nisl suscipit adipiscing. Sagittis orci a scelerisque purus semper eget duis at. Sagittis purus sit amet volutpat. Vitae congue eu consequat ac. Duis at consectetur lorem donec massa sapien. Bibendum arcu vitae elementum curabitur vitae nunc sed velit dignissim. Nisl nisi scelerisque eu ultrices vitae auctor. Ut consequat semper viverra nam.

Cursus euismod quis viverra nibh cras pulvinar mattis nunc sed. Quam quisque id diam vel quam elementum pulvinar. Viverra maecenas accumsan lacus vel facilisis volutpat est velit egestas. Orci phasellus egestas tellus rutrum tellus pellentesque eu. Blandit turpis cursus in hac habitasse platea dictumst quisque sagittis. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Senectus et netus et malesuada fames ac turpis egestas integer. Sed nisi lacus sed viverra tellus. Ac ut consequat semper viverra nam libero justo laoreet. Tellus molestie nunc non blandit massa. Integer vitae justo eget magna fermentum iaculis. Velit aliquet sagittis id consectetur purus ut faucibus pulvinar. Ut consequat semper viverra nam libero. Id neque aliquam vestibulum morbi blandit cursus risus. At imperdiet dui accumsan sit amet nulla facilisi morbi. Posuere morbi leo urna molestie at elementum eu. Sed id semper risus in hendrerit gravida rutrum.

Volutpat sed cras ornare arcu dui vivamus. Sollicitudin ac orci phasellus egestas tellus rutrum. Nibh tellus molestie nunc non blandit massa. Sodales ut etiam sit amet. Eget sit amet tellus cras. Odio euismod lacinia at quis risus sed vulputate odio. Ac tincidunt vitae semper quis lectus nulla at volutpat. Sem viverra aliquet eget sit amet tellus. Adipiscing elit ut aliquam purus sit amet luctus venenatis. Id faucibus nisl tincidunt eget. Lectus quam id leo in vitae turpis massa sed. Pellentesque id nibh tortor id aliquet lectus proin. Dui faucibus in ornare quam viverra orci sagittis eu. Quisque non tellus orci ac auctor augue mauris augue neque. Neque convallis a cras semper auctor neque. Adipiscing commodo elit at imperdiet dui accumsan sit amet nulla. Sapien nec sagittis aliquam malesuada bibendum arcu vitae elementum.

Ac orci phasellus egestas tellus rutrum tellus pellentesque eu. Sit amet nisl purus in. Sed turpis tincidunt id aliquet risus. Rutrum tellus pellentesque eu tincidunt tortor. Integer vitae justo eget magna fermentum. Enim neque volutpat ac tincidunt vitae semper. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing. Egestas egestas fringilla phasellus faucibus scelerisque. Et malesuada fames ac turpis. Diam maecenas ultricies mi eget. Facilisis leo vel fringilla est ullamcorper. Quis hendrerit dolor magna eget. Neque vitae tempus quam pellentesque nec nam aliquam sem et. Ut faucibus pulvinar elementum integer. Odio ut enim blandit volutpat maecenas volutpat blandit.

Neque vitae tempus quam pellentesque. In ornare quam viverra orci sagittis eu. Mi ipsum faucibus vitae aliquet nec ullamcorper sit amet. Et netus et malesuada fames ac turpis. Faucibus a pellentesque sit amet porttitor. Morbi tincidunt ornare massa eget egestas purus viverra accumsan. Ipsum dolor sit amet consectetur adipiscing elit. Lobortis mattis aliquam faucibus purus in massa tempor nec feugiat. Venenatis tellus in metus vulputate eu. Nulla aliquet enim tortor at auctor urna nunc id cursus. Dolor sed viverra ipsum nunc. Mattis pellentesque id nibh tortor id aliquet lectus. Suspendisse faucibus interdum posuere lorem ipsum dolor sit amet. Lacus viverra vitae congue eu consequat ac felis donec. Rhoncus urna neque viverra justo nec ultrices dui sapien eget. Vestibulum sed arcu non odio euismod lacinia at quis risus. Nec dui nunc mattis enim ut tellus elementum sagittis vitae. Ullamcorper sit amet risus nullam. Neque laoreet suspendisse interdum consectetur libero id. Amet mattis vulputate enim nulla aliquet porttitor.", reward: "10")

item_data_process
spell_parsing
