# Warm Kitchen: Google Doc edits to match the finder

The live finder (main `69ce818`) already shows all of this. These edits bring the book, the source of truth, back in line with it. Record ids in the finder don't depend on any of them.

## Index by tradition

Needed. Until these are made, four finder records differ from the book's index:

- [ ] **Turkey:** add **Sahlab**. Its heading says "(Levant and Turkey)" but the index lists it only under Levant, Egypt and Maghreb. Keep it there too.
- [ ] **New line, Mediterranean:** **Leek, Fennel and White Bean Soup**. Take it off the "No single tradition" line.
- [ ] **New line, Central Europe:** **Cabbage with butter and caraway**. This is a "Braise and simmer" Variations bullet, already marked "(Central Europe)".
- [ ] **New line, Northern Europe:** **Parsnip and potato**. This is a "Mash and purée" Variations bullet, already marked "(Northern Europe)".
  - The book's index doesn't list Variations bullets one by one, so for these two the line can say "Cabbage with butter and caraway (Braise and simmer)" and so on. Or skip both lines: the finder has the chips either way.
- [ ] **Optional:** for Kitchari and Spiced Milk, change the heading's bracket from "(Ayurveda)" to "(India / Ayurveda)". For Ayurvedic Spice Blend, add "(India / Ayurveda)". The finder already shows India on all three.
- [ ] **Move four recipes off "No single tradition":** Ghee goes under India, Fish and Kombu Broth and Sweet potato or kabocha with Gomasio go under Japan, and Teff Porridge with Dates and Cardamom goes under Ethiopia. The finder already shows these chips.
- [ ] **Optional:** rename the "No single tradition" line to **Global**, the chip the finder shows for those 14 recipes. The finder accepts either name. What those 18 recipes show is still being discussed.

Not needed for the finder: the compound lines (India and Ayurveda, Persia and Unani, Thailand, Vietnam and Southeast Asia; Levant, Egypt and Maghreb; Russia and Ukraine; New England and the Atlantic). The finder splits them itself, recipe by recipe, from each recipe's origin or title.

If the book should split them too, use these lists, which are the finder's split. **Important:** if the Doc's headings change, the finder's split table (`TRAD_PARTS`) must change with them, followed by `node scripts/finder-data.mjs`.

- India: Mung Dal Tadka; Mustard Greens and Mung Dal; Coconut Squash Dal; Rajma; Kerala Fish Molee; Bengali Mustard Fish Curry; Coconut-Turmeric Sauce; Ghee Tadka; Cilantro-Ginger Chutney; Golden Milk; Til Laddu; Stewed Fruit with Cardamom; Pesarattu
- Ayurveda: Ayurvedic Spice Blend; Cardamom Oat Porridge; Cream of Rice with Ghee and Dates; Kitchari; Salmon with Ghee and Dill; Spiced Milk; Golden Milk; Date and Almond Balls; Stewed Fruit with Cardamom
- Persia: Persian Advieh; Kuku Sabzi; Persian Ash-e Reshteh; Ash-e Jo; Adas Polo; Ghalieh Mahi; Saffron Butter; Walnut-Pomegranate Sauce; Saffron-Cardamom Milk; Persian Sholeh Zard
- Unani: Cream of Rice with Ghee and Dates; Saffron-Cardamom Milk
- Thailand: Tom Kha with Fish; Thai Ginger Shrimp Stir-fry
- Vietnam: Cháo Cá; Súp Măng Cua; Nước Mắm Gừng
- Southeast Asia: Tinolang Isda; Mohinga; Mussels in Coconut-Lemongrass Broth; Peanut-Ginger Sauce
- Levant: Shakshuka; Mujadara; Sardine and Lentil Bowl; Tahini Sauce; Sahlab; Date and Almond Balls
- Egypt: Ful Medames
- Maghreb: Shakshuka; Moroccan Harira; Chermoula Fish Tagine; Chermoula
- Russia: Ukha; Borscht with Lentils; Kasha with Mushrooms
- Ukraine: Borscht with Lentils
- New England: Fish Chowder; Oyster Stew

(Variations bullets are left out of these lists, as the book's index leaves them out.)

## Recipe headings: the bracket holds a note, not an origin

The finder shows each of these notes as the card's origin line.

- [ ] **Tibetan Thukpa (fish):** take "fish" out of the brackets, e.g. "Tibetan Thukpa with Fish", or make the bracket "(Tibet)".
- [ ] **Moroccan Harira (pescatarian):** take "pescatarian" out of the brackets, or make it "(Morocco)".
- [ ] **Brussels sprouts with miso butter (Japan, modern):** this is a Variations bullet under "Roast". Make it "(Japan)" and put "modern" in the bullet's text if wanted. The card currently reads "modern".

## Optional, for consistency

- Ash-e Reshteh "(herb and noodle soup)" and Sholeh Zard "(saffron rice pudding)" could read "(Persian herb and noodle soup)" and "(Persian saffron rice pudding)", like "Persian barley soup".
