# Endonyms: review sheet

155 of the 233 recipes have an entry: 130 high confidence, 25 medium, 0 low. The other 78 are skipped. The names live in each recipe's `names` field in `warm_kitchen_finder.html` (added 2026-11-20). Chinese entries were checked with OpenCC for simplified characters.

## 1. Medium-confidence entries (25)

| id | native | lang | romanized | why it is medium |
|---|---|---|---|---|
| `ginger-congee-with-egg` | 薑絲雞蛋粥 | zh-Hant | Jiangsi Jidan Zhou | A descriptive home-cooking name, common on recipe sites but not a fixed classic. |
| `tsampa-porridge` | རྩམ་པ | bo | Tsampa | The word names the flour (and tsampa mixed with tea). A cooked tsampa porridge is རྩམ་ཐུག (tsamthuk). |
| `teff-porridge-with-niter-kibbeh` | ገንፎ | am | Genfo | Genfo-style. Real genfo is usually a barley or wheat flour porridge; this one uses whole teff. |
| `blue-corn-mush` | taaʼniil | nv | | Navajo, confirmed by Wiktionary and an NAU Diné curriculum (synonym: tanaashgiizh). Diacritics are worth a check with a Diné speaker. |
| `chinese-fish-and-ginger-soup` | 薑絲魚片湯 | zh-Hant | Jiangsi Yupian Tang | A descriptive but common name. Cantonese reading: goeng si jyu pin tong. |
| `miso-soup-with-tofu-and-soba` | 味噌汁 | ja | Misoshiru | Names the base dish only; the soba is the book's addition. |
| `sisnu-ko-jhol` | सिस्नुको झोल | ne | Sisnu ko Jhol | Also often called सिस्नुको सुप or just सिस्नु. |
| `borscht-with-lentils` | борщ | uk | Borshch | The lentils are an adaptation. Ukrainian vs Russian is a judgment call (the spelling is the same in both). |
| `fish-and-daikon-braise` | ぶり大根 | ja | Buri Daikon | The book calls it a home version of buri daikon, but it uses mackerel or salmon instead of yellowtail. |
| `kerala-fish-molee` | മീൻ മോളി | ml | Meen Molee | Kerala menus write ഫിഷ് മോളി (fish molee) just as often. |
| `chermoula-fish-tagine` | طاجين الحوت بالشرمولة | ar | Tajine el Hout bel Chermoula | Moroccan Arabic. Also commonly written in French in Morocco. |
| `fish-in-bazhe` | ბაჟე | ka | Bazhe | Names the sauce only. I could not verify a fixed Georgian name for the fish dish. |
| `tikin-xik` | Tikin xiik' | yua | | Modern Yucatec orthography. Menus write tikin xic. |
| `thai-ginger-shrimp-stir-fry` | กุ้งผัดขิง | th | Kung Phat Khing | Pad khing is real; the vegetables are the book's own. |
| `baigan-choka` | Baigan choka | en-TT | | Trinidadian, from Bhojpuri बैगन चोखा. Language tag is a judgment call (see §2). |
| `cabbage-with-cumin-and-turmeric` | पत्ता गोभी की सब्ज़ी | hi | Patta Gobhi ki Sabzi | The book's origin says only "patta gobhi"; I added "ki sabzi". |
| `watermelon-rind-with-ginger` | 炒西瓜皮 | zh-Hant | Chao Xigua Pi | A real home dish, but it is a variation inside a technique section. |
| `cilantro-ginger-chutney` | धनिया अदरक की चटनी | hi | Dhaniya Adrak ki Chutney | Descriptive. The classic is धनिया चटनी. |
| `walnut-pomegranate-sauce` | فسنجان | fa | Fesenjan | The book calls it "a quick fesenjan"; real fesenjan is a stew. |
| `tahini-sauce` | طحينة | ar | Tahina | Also طرطور (tarator) in Lebanon and Syria. |
| `lemon-caper-brown-butter` | Beurre noisette aux câpres | fr | | Descriptive. The named classic, à la grenobloise, adds croutons. |
| `spiced-milk` | मसाला दूध | hi | Masala Doodh | The Ayurvedic version (ghee, ashwagandha) is a stretch from the street drink. Cut it if it feels forced. |
| `black-sesame-paste` | 黑芝麻醬 | zh-Hant | Hei Zhima Jiang | The book's recipe is a spread. Not 黑芝麻糊, which is the sweet soup. |
| `roasted-sweet-potato` | 焼き芋 | ja | Yaki-imo | The recipe is tagged both Japan and Korea; Korean would be 군고구마. |
| `dhalpuri-roti` | Dhalpuri roti | en-TT | | Trinidadian, from Bhojpuri दालपूरी. Same tag question as baigan choka. |

## 2. Judgment calls

**Inclusions you might disagree with**
- `ghee` → घी (hi). The recipe is tagged "No single tradition", but the word is Hindi and the book frames ghee in Ayurvedic terms. This is the only "No single tradition" recipe I included.
- `h-jicha-ochazuke-with-salmon` → お茶漬け "Ochazuke", the general name that matches the book. The salmon-specific name is 鮭茶漬け (sake chazuke).
- `saba-shioyaki` → 鯖の塩焼き "Saba no Shioyaki". The book's "Saba Shioyaki" is the menu shorthand (さば塩焼き). Swap to that if you want the romanization to match the title exactly.
- `three-cup-shrimp-or-tofu` → 三杯蝦 "San Bei Xia". The book only says "San Bei"; the tofu version is 三杯豆腐.
- `braised-eggs-and-tofu` → 滷蛋 "Lu Dan" (the book's term). Braised tofu is 滷豆腐.
- `garlic-yogurt-with-paprika-butter-turkey` → "Sarımsaklı yoğurt", which is literally "garlic yogurt". With the butter on top it is the sauce of çılbır.

**Language choices**
- Cantonese dishes (`chinese-fish-and-ginger-soup`, `steamed-fish-with-ginger-and-scallion`, `ginger-scallion-oil`, `black-bean-garlic-sauce`, `ginger-milk-curd`) are tagged `zh-Hant` with pinyin, to match the book's pinyin elsewhere. The Jyutping reading is in each note. If you'd rather show Cantonese, the tag would be `yue-Hant` and the romanized field Jyutping.
- The two Taiwanese Hokkien dishes (`oyster-omelette` 蚵仔煎, `oyster-noodle-soup` 蚵仔麵線) are tagged `nan-Hant-TW`, because the book romanizes them in Tâi-lô (Ô-á-tsian, Ô-á Mī-suànn). Use `zh-Hant` instead if the app only expects that tag. The characters are the same either way.
- The other Taiwan dishes (地瓜粥, 番茄炒蛋, 麻油麵線, 滷蛋, 塔香蛤蜊, 三杯蝦, 黑糖薑茶, 花生湯) are `zh-Hant` with Mandarin pinyin, matching the book's romanizations.
- Regional Indian dishes use the regional language: Bengali সর্ষে মাছ, Malayalam മീൻ മോളി and തോരൻ, Telugu పెసరట్టు. Everything else Indian is Hindi.
- `momo-in-jhol` → Nepali झोल मोमो rather than Tibetan, because jhol momo is a Kathmandu dish. Tibetan for momo is མོག་མོག.
- `spinach-with-raisins-and-pine-nuts` and `romesco` → Catalan (`ca`), not Spanish.
- `chermoula-fish-tagine` → Moroccan Arabic حوت rather than Standard Arabic سمك.
- `shakshuka` → Arabic شكشوكة. Hebrew שקשוקה is equally common in Israel.
- `api-morado` → `es`. Api is a Quechua word, but the name as a whole is Bolivian Spanish.
- Trinidad dishes → `en-TT`. `trf` (Trinidadian Creole English) is valid BCP 47 and stricter, but less likely to be handled by fonts and screen readers.

**Skipped but maybe**
| id | possible name | why skipped |
|---|---|---|
| `rye-porridge` | Finnish ruispuuro / Swedish rågflingsgröt | The book says "Scandinavia" and gives no single country, so I couldn't pick a language. |
| `fish-tea`, `cornmeal-porridge`, `callaloo-with-crab`, `jamaican-steamed-fish` | (English) | Jamaican and Trinidadian dishes whose local name is already English. |
| `fish-pepper-soup` | | Nigerians mostly say "pepper soup" in English. A Yoruba or Igbo name would be a guess. |
| `three-sisters-stew` | | Haudenosaunee. I'm not confident of a Mohawk or Seneca dish name. |
| `manoomin-with-trout-mushrooms-and-berries` | Ojibwe manoomin | Manoomin names the rice, not this adapted dish. |
| `mustard-greens-and-mung-dal`, `coconut-squash-dal` | sarson moong dal / parippu | Adapted. Neither matches one canonical dish. |
| `clams-in-ginger-scallion-broth`, `shrimp-with-celery-snap-peas-and-water-chestnuts`, `ginger-bok-choy`, the other Chinese stir-fry variations | | Generic descriptive stir-fries with no fixed name. 薑蔥炒蜆 is a stir-fry, not a broth. |
| `braised-leeks` | poireaux braisés | A generic technique variation. |
| `ginger-tamari-dressing` | 生姜醤油 | Close, but the book's mirin and vinegar make it something else. |
| `saffron-cardamom-milk`, `saffron-butter` | شیر زعفرانی / کره زعفرانی | Descriptive phrases, not named dishes. |
| `ginger-green-tea` | | Generic. |

**Skipped, clearly no native name:** the technique headers (Roast, Sauté, Braise, Steam, Mash), their generic vegetable variations, and the broths, oat, teff and rice porridges Sara adapted. Also the remaining "No single tradition" recipes, plus the blackstrap tonic, nettle tea, date balls, stewed fruit, Ayurvedic spice blend, skillet flatbread, salmon with ghee, trout with thyme, sardine bowl and mussels.

## 3. Chinese spot-check (traditional vs simplified)

OpenCC (`s2t`, character by character and whole-string) finds no simplified-only character. The "simplified" column is OpenCC `t2s` output, shown only for contrast.

| id | native (traditional) | simplified for contrast | romanized | lang |
|---|---|---|---|---|
| `ginger-congee-with-egg` | 薑絲雞蛋粥 | 姜丝鸡蛋粥 | Jiangsi Jidan Zhou | zh-Hant |
| `millet-and-kabocha-porridge` | 小米南瓜粥 | 小米南瓜粥 | Xiaomi Nangua Zhou | zh-Hant |
| `eight-treasure-congee` | 八寶粥 | 八宝粥 | Babao Zhou | zh-Hant |
| `red-bean-and-barley-congee` | 紅豆薏米粥 | 红豆薏米粥 | Hong Dou Yi Mi Zhou | zh-Hant |
| `sweet-potato-congee` | 地瓜粥 | 地瓜粥 | Digua Zhou | zh-Hant |
| `tomato-and-egg-stir-fry` | 番茄炒蛋 | 番茄炒蛋 | Fanqie Chao Dan | zh-Hant |
| `oyster-omelette` | 蚵仔煎 | 蚵仔煎 | Ô-á-tsian | nan-Hant-TW |
| `chinese-fish-and-ginger-soup` | 薑絲魚片湯 | 姜丝鱼片汤 | Jiangsi Yupian Tang | zh-Hant |
| `spinach-egg-drop-soup` | 菠菜蛋花湯 | 菠菜蛋花汤 | Bocai Danhua Tang | zh-Hant |
| `sesame-oil-noodles-with-egg` | 麻油麵線 | 麻油面线 | Ma You Mian Xian | zh-Hant |
| `oyster-noodle-soup` | 蚵仔麵線 | 蚵仔面线 | Ô-á Mī-suànn | nan-Hant-TW |
| `braised-eggs-and-tofu` | 滷蛋 | 卤蛋 | Lu Dan | zh-Hant |
| `steamed-fish-with-ginger-and-scallion` | 清蒸魚 | 清蒸鱼 | Qingzheng Yu | zh-Hant |
| `clams-with-basil` | 塔香蛤蜊 | 塔香蛤蜊 | Ta Xiang Ge Li | zh-Hant |
| `three-cup-shrimp-or-tofu` | 三杯蝦 | 三杯虾 | San Bei Xia | zh-Hant |
| `watermelon-rind-with-ginger` | 炒西瓜皮 | 炒西瓜皮 | Chao Xigua Pi | zh-Hant |
| `ginger-scallion-oil` | 薑蔥蓉 | 姜葱蓉 | Jiangcong Rong | zh-Hant |
| `black-bean-garlic-sauce` | 豉汁 | 豉汁 | Chizhi | zh-Hant |
| `goji-longan-and-red-date-tea` | 紅棗桂圓枸杞茶 | 红枣桂圆枸杞茶 | Hongzao Guiyuan Gouqi Cha | zh-Hant |
| `brown-sugar-ginger-tea` | 黑糖薑茶 | 黑糖姜茶 | Hei Tang Jiang Cha | zh-Hant |
| `black-sesame-paste` | 黑芝麻醬 | 黑芝麻酱 | Hei Zhima Jiang | zh-Hant |
| `ginger-milk-curd` | 薑汁撞奶 | 姜汁撞奶 | Jiangzhi Zhuangnai | zh-Hant |
| `peanut-soup` | 花生湯 | 花生汤 | Hua Sheng Tang | zh-Hant |
| `black-sesame-tangyuan-in-ginger-syrup` | 黑芝麻湯圓 | 黑芝麻汤圆 | Hei Zhima Tangyuan | zh-Hant |

Rows where both columns are identical (小米南瓜粥, 地瓜粥, 番茄炒蛋, 蚵仔煎, 塔香蛤蜊, 炒西瓜皮, 豉汁) use characters that are the same in both scripts. Ginger is 薑 throughout, never 姜, and noodles are 麵, never 面.

## 4. The book's own romanizations

- **Inconsistent pinyin word-joining.** "Xiaomi Nangua Zhou" and "Babao Zhou" join syllables into words. "Hong Dou Yi Mi Zhou", "Ma You Mian Xian", "Ta Xiang Ge Li", "Hei Tang Jiang Cha", "Hua Sheng Tang" and "San Bei" split every syllable. Standard pinyin would be Hongdou Yimi Zhou, Mayou Mianxian, Taxiang Geli, Heitang Jiang Cha, Huasheng Tang, Sanbei. I kept the book's spelling in `romanized` as instructed.
- **Macrons used unevenly.** "Hōjicha" has one,, but "Kinpira Gobo" should be gobō. "Gomasio" is the macrobiotic spelling; Hepburn is gomashio.
- **Titles are fine, but ids were mangled by slugging** wherever there are diacritics: `ch-o-c` (Cháo Cá), `s-p-m-ng-cua`, `n-c-m-m-g-ng`, `hal-szl`, `a-orda-de-marisco`, `bl-b-rssoppa`, `h-jicha-ochazuke-with-salmon`, `saut-and-stir-fry…`, `mash-and-pur-e…`. They work as keys but are unreadable.
- **The `origin` field sometimes holds a descriptor instead of a place**: `tibetan-thukpa` = "fish", `moroccan-harira` = "pescatarian", `persian-ash-e-reshteh` = "herb and noodle soup".
- **Vietnamese capitalisation.** "Cháo Cá", "Súp Măng Cua" and "Nước Mắm Gừng" are title-cased; Vietnamese writes Cháo cá and so on. The native field uses sentence case.
