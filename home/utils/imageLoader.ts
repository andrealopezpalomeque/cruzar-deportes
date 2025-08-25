import type { CategoryType } from '~/types'

// Utility to load actual image files from the scraped data
export async function getTeamImages(teamKey: string, category: CategoryType): Promise<string[]> {
  try {
    // In a real app, this would be a server-side API call
    // For now, we'll use the known image structure from the scraped data
    const basePath = `/images/${category}/${teamKey}`
    
    // Map of actual image counts based on scraped data
    const imageFiles: Record<string, string[]> = {
      // AFC Teams
      'johor': [
        'johor_photo_img_0_1755054047472.jpg',
        'johor_photo_img_1_1755054049789.jpg', 
        'johor_photo_img_2_1755054052725.jpg',
        'johor_photo_img_3_1755054055088.jpg',
        'johor_photo_img_4_1755054058465.jpg',
        'johor_photo_img_5_1755054060327.jpg'
      ],
      'johor_kid_kit': [
        'johor_kid_kit_photo_img_0_1755053226472.jpg',
        'johor_kid_kit_photo_img_1_1755053229276.jpg'
      ],
      'seoul_fc': [
        'seoul_fc_photo_img_0_1755054016478.jpg',
        'seoul_fc_photo_img_1_1755054018699.jpg',
        'seoul_fc_photo_img_2_1755054021082.jpg',
        'seoul_fc_photo_img_3_1755054023453.jpg'
      ],
      'suwon_fc': [
        'suwon_fc_photo_img_0_1755053248869.jpg',
        'suwon_fc_photo_img_1_1755053252651.jpg',
        'suwon_fc_photo_img_2_1755053256885.jpg',
        'suwon_fc_photo_img_3_1755053260847.jpg'
      ],
      'suwon_samsung': [
        'suwon_samsung_photo_img_0_1755053203613.jpg',
        'suwon_samsung_photo_img_1_1755053205752.jpg'
      ],
      'ulsan_hd': [
        'ulsan_hd_photo_img_0_1755053283872.jpg',
        'ulsan_hd_photo_img_1_1755053286897.jpg',
        'ulsan_hd_photo_img_2_1755053290326.jpg',
        'ulsan_hd_photo_img_3_1755053292577.jpg'
      ],

      // CAF Teams  
      'al_ahly': [
        'al_ahly_photo_img_0_1755052280024.jpg',
        'al_ahly_photo_img_1_1755052284986.jpg',
        'al_ahly_photo_img_2_1755052287178.jpg',
        'al_ahly_photo_img_3_1755052292212.jpg'
      ],
      'cs_constantine_player_version': [
        'cs_constantine_player_version_photo_img_0_1755052486678.jpg',
        'cs_constantine_player_version_photo_img_1_1755052491337.jpg',
        'cs_constantine_player_version_photo_img_2_1755052493471.jpg',
        'cs_constantine_player_version_photo_img_3_1755052496035.jpg'
      ],
      'kaizer_chiefs': [
        'kaizer_chiefs_photo_img_0_1755024343494.jpg',
        'kaizer_chiefs_photo_img_1_1755024346183.jpg',
        'kaizer_chiefs_photo_img_2_1755024349282.jpg',
        'kaizer_chiefs_photo_img_3_1755024351840.jpg',
        'kaizer_chiefs_photo_img_4_1755024355296.jpg'
      ],
      'mamelodi_player_version': [
        'mamelodi_player_version_photo_img_0_1755052621848.jpg',
        'mamelodi_player_version_photo_img_1_1755052626065.jpg',
        'mamelodi_player_version_photo_img_2_1755052627904.jpg',
        'mamelodi_player_version_photo_img_3_1755052630469.jpg',
        'mamelodi_player_version_photo_img_4_1755052632875.jpg'
      ],
      'orlando_pirates': [
        'orlando_pirates_photo_img_0_1755024922367.jpg',
        'orlando_pirates_photo_img_1_1755024924900.jpg',
        'orlando_pirates_photo_img_2_1755024927344.jpg',
        'orlando_pirates_photo_img_3_1755024929205.jpg',
        'orlando_pirates_photo_img_4_1755024932268.jpg'
      ],
      'young_africans': [
        'young_africans_photo_img_0_1755024846013.jpg',
        'young_africans_photo_img_1_1755024849500.jpg',
        'young_africans_photo_img_2_1755024851586.jpg',
        'young_africans_photo_img_3_1755024854973.jpg'
      ],

      // Eredivisie Teams
      'ajax': [
        'ajax_photo_img_0_1755059872377.jpg',
        'ajax_photo_img_1_1755059875040.jpg',
        'ajax_photo_img_2_1755059878176.jpg',
        'ajax_photo_img_3_1755059881292.jpg',
        'ajax_photo_img_4_1755059884993.jpg',
        'ajax_photo_img_5_1755059887106.jpg'
      ],
      'ajax_authentic': [
        'ajax_authentic_photo_img_0_1755059029828.jpg',
        'ajax_authentic_photo_img_1_1755059033719.jpg',
        'ajax_authentic_photo_img_2_1755059037183.jpg',
        'ajax_authentic_photo_img_3_1755059040941.jpg',
        'ajax_authentic_photo_img_4_1755059045570.jpg',
        'ajax_authentic_photo_img_5_1755059049202.jpg'
      ],
      'ajax_gk': [
        'ajax_gk_photo_img_0_1755059737518.jpg',
        'ajax_gk_photo_img_1_1755059742263.jpg',
        'ajax_gk_photo_img_2_1755059744389.jpg',
        'ajax_gk_photo_img_3_1755059746752.jpg'
      ],
      'ajax_kid_kit': [
        'ajax_kid_kit_photo_img_0_1755059206956.jpg',
        'ajax_kid_kit_photo_img_1_1755059210021.jpg',
        'ajax_kid_kit_photo_img_2_1755059212792.jpg',
        'ajax_kid_kit_photo_img_3_1755059216156.jpg',
        'ajax_kid_kit_photo_img_4_1755059218573.jpg',
        'ajax_kid_kit_photo_img_5_1755059221033.jpg'
      ],
      'ajax_shorts': [
        'ajax_shorts_photo_img_0_1755059504410.jpg',
        'ajax_shorts_photo_img_1_1755059508552.jpg',
        'ajax_shorts_photo_img_2_1755059516015.jpg',
        'ajax_shorts_photo_img_3_1755059518934.jpg',
        'ajax_shorts_photo_img_4_1755059522715.jpg',
        'ajax_shorts_photo_img_5_1755059526162.jpg'
      ],
      'ajax_shorts_authentic': [
        'ajax_shorts_authentic_photo_img_0_1755058767709.jpg',
        'ajax_shorts_authentic_photo_img_1_1755058772405.jpg',
        'ajax_shorts_authentic_photo_img_2_1755058776805.jpg',
        'ajax_shorts_authentic_photo_img_3_1755058780207.jpg',
        'ajax_shorts_authentic_photo_img_4_1755058783193.jpg'
      ],
      'az_alkmaar': [
        'az_alkmaar_photo_img_0_1755059562342.jpg',
        'az_alkmaar_photo_img_1_1755059566328.jpg',
        'az_alkmaar_photo_img_2_1755059569465.jpg',
        'az_alkmaar_photo_img_3_1755059571746.jpg',
        'az_alkmaar_photo_img_4_1755059574629.jpg',
        'az_alkmaar_photo_img_5_1755059577375.jpg'
      ],
      'az_alkmaar_kid_kit': [
        'az_alkmaar_kid_kit_photo_img_0_1755058823628.jpg',
        'az_alkmaar_kid_kit_photo_img_1_1755058826236.jpg'
      ],
      'az_alkmaar_shorts': [
        'az_alkmaar_shorts_photo_img_0_1755058936529.jpg',
        'az_alkmaar_shorts_photo_img_1_1755058939527.jpg',
        'az_alkmaar_shorts_photo_img_2_1755058941295.jpg',
        'az_alkmaar_shorts_photo_img_3_1755058943332.jpg',
        'az_alkmaar_shorts_photo_img_4_1755058945476.jpg'
      ],
      'feyenoord': [
        'feyenoord_photo_img_0_1755059622557.jpg',
        'feyenoord_photo_img_1_1755059624825.jpg',
        'feyenoord_photo_img_2_1755059628583.jpg',
        'feyenoord_photo_img_3_1755059632049.jpg',
        'feyenoord_photo_img_4_1755059634615.jpg',
        'feyenoord_photo_img_5_1755059638085.jpg'
      ],
      'feyenoord_kid_kit': [
        'feyenoord_kid_kit_photo_img_0_1755058893629.jpg',
        'feyenoord_kid_kit_photo_img_1_1755058896925.jpg',
        'feyenoord_kid_kit_photo_img_2_1755058900974.jpg',
        'feyenoord_kid_kit_photo_img_3_1755058903633.jpg',
        'feyenoord_kid_kit_photo_img_4_1755058907048.jpg'
      ],
      'feyenoord_short': [
        'feyenoord_short_photo_img_0_1755058972588.png',
        'feyenoord_short_photo_img_2_1755058978379.png'
      ],
      'psv': [
        'psv_photo_img_0_1755058617736.jpg',
        'psv_photo_img_1_1755058622603.jpg',
        'psv_photo_img_2_1755058626082.jpg',
        'psv_photo_img_3_1755058627899.jpg',
        'psv_photo_img_4_1755058630446.jpg',
        'psv_photo_img_5_1755058633950.jpg',
        'psv_photo_img_6_1755058637221.jpg',
        'psv_photo_img_7_1755058640799.jpg',
        'psv_photo_img_8_1755058644131.jpg',
        'psv_photo_img_9_1755058647326.jpg'
      ],
      'psv_gk': [
        'psv_gk_photo_img_0_1755059764546.png',
        'psv_gk_photo_img_2_1755059770597.png',
        'psv_gk_photo_img_3_1755059773091.png',
        'psv_gk_photo_img_4_1755059775628.png'
      ],
      'psv_gk_kid_kit': [
        'psv_gk_kid_kit_photo_img_0_1755058993835.jpg',
        'psv_gk_kid_kit_photo_img_1_1755058997694.jpg',
        'psv_gk_kid_kit_photo_img_2_1755059001195.jpg',
        'psv_gk_kid_kit_photo_img_3_1755059004372.jpg'
      ],
      'psv_gk_short': [
        'psv_gk_short_photo_img_0_1755059183160.png',
        'psv_gk_short_photo_img_2_1755059189255.png',
        'psv_gk_short_photo_img_3_1755059191393.png',
        'psv_gk_short_photo_img_4_1755059194474.png'
      ],
      'psv_kid_kit': [
        'psv_kid_kit_photo_img_0_1755059336331.jpg',
        'psv_kid_kit_photo_img_1_1755059340789.jpg',
        'psv_kid_kit_photo_img_2_1755059343954.jpg',
        'psv_kid_kit_photo_img_3_1755059347361.jpg',
        'psv_kid_kit_photo_img_4_1755059352229.jpg',
        'psv_kid_kit_photo_img_5_1755059354934.jpg'
      ],
      'psv_short': [
        'psv_short_photo_img_0_1755059604171.png',
        'psv_short_photo_img_2_1755059610938.png'
      ],
      'sc_heerenveen': [
        'sc_heerenveen_photo_img_0_1755059140838.jpg',
        'sc_heerenveen_photo_img_1_1755059143979.jpg',
        'sc_heerenveen_photo_img_2_1755059147359.jpg',
        'sc_heerenveen_photo_img_3_1755059149856.jpg',
        'sc_heerenveen_photo_img_4_1755059151893.jpg'
      ],
      'twente': [
        'twente_photo_img_0_1755059791371.jpg',
        'twente_photo_img_1_1755059796229.jpg',
        'twente_photo_img_2_1755059800502.jpg',
        'twente_photo_img_3_1755059804865.jpg',
        'twente_photo_img_4_1755059807968.jpg'
      ],

      // Serie A Enilive Teams
      'atalanta': [
        'atalanta_photo_img_0_1755103282634.jpg',
        'atalanta_photo_img_1_1755103287131.jpg',
        'atalanta_photo_img_2_1755103289849.jpg',
        'atalanta_photo_img_3_1755103292015.jpg',
        'atalanta_photo_img_4_1755103296401.jpg',
        'atalanta_photo_img_5_1755103299279.jpg'
      ],
      'atalanta_kit_kit': [
        'atalanta_kit_kit_photo_img_0_1755098991995.jpg',
        'atalanta_kit_kit_photo_img_1_1755098995738.jpg',
        'atalanta_kit_kit_photo_img_2_1755098998101.jpg',
        'atalanta_kit_kit_photo_img_3_1755099000882.jpg',
        'atalanta_kit_kit_photo_img_4_1755099004010.jpg',
        'atalanta_kit_kit_photo_img_5_1755099007425.jpg'
      ],
      'atalanta_short': [
        'atalanta_short_photo_img_0_1755099992865.jpg',
        'atalanta_short_photo_img_1_1755099996923.jpg',
        'atalanta_short_photo_img_2_1755099998890.jpg',
        'atalanta_short_photo_img_3_1755100001956.jpg',
        'atalanta_short_photo_img_4_1755100004157.jpg',
        'atalanta_short_photo_img_5_1755100007855.jpg'
      ],
      'cagliari': [
        'cagliari_photo_img_0_1755103157206.jpg',
        'cagliari_photo_img_1_1755103162106.jpg',
        'cagliari_photo_img_2_1755103166268.jpg',
        'cagliari_photo_img_3_1755103169397.jpg',
        'cagliari_photo_img_4_1755103171754.jpg',
        'cagliari_photo_img_5_1755103174211.jpg'
      ],
      'cagliari_kid_kit': [
        'cagliari_kid_kit_photo_img_0_1755098961906.jpg',
        'cagliari_kid_kit_photo_img_1_1755098965297.jpg',
        'cagliari_kid_kit_photo_img_2_1755098968547.jpg',
        'cagliari_kid_kit_photo_img_3_1755098970860.jpg',
        'cagliari_kid_kit_photo_img_4_1755098972971.jpg',
        'cagliari_kid_kit_photo_img_5_1755098976235.jpg'
      ],
      'cagliari_short': [
        'cagliari_short_photo_img_0_1755099960525.png',
        'cagliari_short_photo_img_2_1755099965989.png',
        'cagliari_short_photo_img_3_1755099968472.png',
        'cagliari_short_photo_img_4_1755099971749.png',
        'cagliari_short_photo_img_5_1755099975024.png'
      ],
      'fiorentina': [
        'fiorentina_photo_img_0_1755102901173.jpg',
        'fiorentina_photo_img_1_1755102905496.jpg',
        'fiorentina_photo_img_2_1755102910216.jpg',
        'fiorentina_photo_img_3_1755102913306.jpg',
        'fiorentina_photo_img_4_1755102916049.jpg',
        'fiorentina_photo_img_5_1755102919374.jpg'
      ],
      'fiorentina_kid_kit': [
        'fiorentina_kid_kit_photo_img_0_1755098759927.jpg',
        'fiorentina_kid_kit_photo_img_1_1755098763702.jpg',
        'fiorentina_kid_kit_photo_img_2_1755098766715.jpg',
        'fiorentina_kid_kit_photo_img_3_1755098769427.jpg',
        'fiorentina_kid_kit_photo_img_4_1755098771860.jpg',
        'fiorentina_kid_kit_photo_img_5_1755098774005.jpg'
      ],
      'fiorentina_short': [
        'fiorentina_short_photo_img_0_1755099099847.jpg',
        'fiorentina_short_photo_img_1_1755099104162.jpg',
        'fiorentina_short_photo_img_2_1755099108556.jpg',
        'fiorentina_short_photo_img_3_1755099112744.jpg',
        'fiorentina_short_photo_img_4_1755099116691.jpg',
        'fiorentina_short_photo_img_5_1755099120774.jpg'
      ],
      'inter_authentic': [
        'inter_authentic_photo_img_0_1755099253827.jpg',
        'inter_authentic_photo_img_1_1755099258648.jpg',
        'inter_authentic_photo_img_2_1755099261833.jpg',
        'inter_authentic_photo_img_3_1755099264739.jpg',
        'inter_authentic_photo_img_4_1755099268348.jpg',
        'inter_authentic_photo_img_5_1755099271387.jpg'
      ],
      'inter_kid_kit': [
        'inter_kid_kit_photo_img_0_1755100492174.jpg',
        'inter_kid_kit_photo_img_1_1755100494877.jpg',
        'inter_kid_kit_photo_img_2_1755100498827.jpg',
        'inter_kid_kit_photo_img_3_1755100501381.jpg',
        'inter_kid_kit_photo_img_4_1755100505754.jpg',
        'inter_kid_kit_photo_img_5_1755100509132.jpg'
      ],
      'inter_kid_kit_authentic': [
        'inter_kid_kit_authentic_photo_img_0_1755097400070.jpg',
        'inter_kid_kit_authentic_photo_img_1_1755097403678.jpg',
        'inter_kid_kit_authentic_photo_img_2_1755097407229.jpg',
        'inter_kid_kit_authentic_photo_img_3_1755097410264.jpg',
        'inter_kid_kit_authentic_photo_img_4_1755097413709.jpg',
        'inter_kid_kit_authentic_photo_img_5_1755097418175.jpg'
      ],
      'bologna_kid_kit': [
        'bologna_kid_kit_photo_img_0_1755099808149.jpg',
        'bologna_kid_kit_photo_img_1_1755099811108.jpg',
        'bologna_kid_kit_photo_img_2_1755099814826.jpg',
        'bologna_kid_kit_photo_img_3_1755099818523.jpg',
        'bologna_kid_kit_photo_img_4_1755099821673.jpg',
        'bologna_kid_kit_photo_img_5_1755099826664.jpg'
      ],
      'bologna_short': [
        'bologna_short_photo_img_0_1755100847153.jpg',
        'bologna_short_photo_img_1_1755100850729.jpg',
        'bologna_short_photo_img_2_1755100854707.jpg',
        'bologna_short_photo_img_3_1755100857715.jpg',
        'bologna_short_photo_img_4_1755100860848.jpg',
        'bologna_short_photo_img_5_1755100863693.jpg'
      ],
      'bari_long_sleeve': [
        'bari_long_sleeve_photo_img_0_1755099155267.jpg',
        'bari_long_sleeve_photo_img_1_1755099159246.jpg',
        'bari_long_sleeve_photo_img_2_1755099162773.jpg',
        'bari_long_sleeve_photo_img_3_1755099165260.jpg',
        'bari_long_sleeve_photo_img_4_1755099167788.jpg',
        'bari_long_sleeve_photo_img_5_1755099170809.jpg'
      ],
      '161842622uid1issubcatefalsereferrercate334382': [
        '161842622uid1issubcatefalsereferrercate334382_photo_img_0_1755096745199.jpg',
        '161842622uid1issubcatefalsereferrercate334382_photo_img_1_1755096749433.jpg',
        '161842622uid1issubcatefalsereferrercate334382_photo_img_2_1755096753784.jpg',
        '161842622uid1issubcatefalsereferrercate334382_photo_img_3_1755096757252.jpg',
        '161842622uid1issubcatefalsereferrercate334382_photo_img_4_1755096762812.jpg',
        '161842622uid1issubcatefalsereferrercate334382_photo_img_5_1755096768449.jpg'
      ]
    }

    const files = imageFiles[teamKey] || []
    
    // If no images are explicitly defined, return empty array
    if (files.length === 0) {
      return []
    }
    
    return files.map(filename => `${basePath}/${filename}`)
    
  } catch (error) {
    console.error('Error loading team images:', error)
    return []
  }
}