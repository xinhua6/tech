import Mock from 'mockjs'
export default {
  tableData01: (req) => {
    return Mock.mock({
      'data': [
        {
          name: '合同一',
          number: 1,
          typeName: '类型一'
        },
        {
          name: '合同二',
          number: 2,
          typeName: '类型二'
        },
        {
          name: '合同三',
          number: 3,
          typeName: '类型三'
        },
        {
          name: '合同四',
          number: 4,
          typeName: '类型四'
        },
      ],
      'success': true
    })
  },
  tableData02: (req) => {
    return Mock.mock({
      'data': [
        {
          "projId":100762,
          "projTypeid":21,
          "projName":"测试专用-报表系统-202004090001",
          "agentInvest":5000000.0000,
          "projInvestment":10000000.0000,
          "planZbdlf":100.0000,
          "planQqgzf":101.0000,
          "planRecZbdlf":10.0000,
          "planRecQqgzf":11.0000
        },
        {
          "projId":100682,
          "projTypeid":21,
          "projName":"测试专用-报表系统-202003210001",
          "agentInvest":null,
          "projInvestment":10000.0000,
          "planZbdlf":100.0000,
          "planQqgzf":101.0000,
          "planRecZbdlf":228.0000,
          "planRecQqgzf":12.0000
        },
        {
          "projId":13450,
          "projTypeid":21,
          "projName":"金山大道坑头平交改造工程",
          "agentInvest":null,
          "projInvestment":2907.0000,
          "planZbdlf":25.0000,
          "planQqgzf":0.0000,
          "planRecZbdlf":null,
          "planRecQqgzf":null
        },
        {
          "projId":13410,
          "projTypeid":21,
          "projName":"广明高速公路辅道扩建工程",
          "agentInvest":null,
          "projInvestment":24786.0000,
          "planZbdlf":62.0000,
          "planQqgzf":21.0000,
          "planRecZbdlf":null,
          "planRecQqgzf":null
        },
        {
          "projId":13330,
          "projTypeid":21,
          "projName":"番禺区盛龙安置区（二期）安置房工程",
          "agentInvest":null,
          "projInvestment":67878.0000,
          "planZbdlf":40.0000,
          "planQqgzf":8.0000,
          "planRecZbdlf":null,
          "planRecQqgzf":null
        },
        {
          "projId":13320,
          "projTypeid":21,
          "projName":"番禺区盛龙安置区（二期）郭塱村工程",
          "agentInvest":null,
          "projInvestment":30693.0000,
          "planZbdlf":23.0000,
          "planQqgzf":5.0000,
          "planRecZbdlf":null,
          "planRecQqgzf":null
        },
        {
          "projId":13480,
          "projTypeid":22,
          "projName":"南大干线项目（钟三路至东新高速段）（变压器房迁改）",
          "agentInvest":null,
          "projInvestment":null,
          "planZbdlf":0.0000,
          "planQqgzf":0.0000,
          "planRecZbdlf":null,
          "planRecQqgzf":null
        },
        {
          "projId":13470,
          "projTypeid":22,
          "projName":"海华大桥项目（管线迁改）",
          "projCont":null,
          "agentInvest":null,
          "projInvestment":null,
          "planZbdlf":0.0000,
          "planQqgzf":0.0000,
          "planRecZbdlf":null,
          "planRecQqgzf":null
        },
        {
          "projId":13460,
          "projTypeid":22,
          "projName":"新造新城安置区（二期）项目",
          "agentInvest":null,
          "projInvestment":38099.0000,
          "planZbdlf":35.0000,
          "planQqgzf":60.0000,
          "planRecZbdlf":null,
          "planRecQqgzf":null
        },
        {
          "projId":13440,
          "projTypeid":22,
          "projName":"滨河路（市新路至新化快速）沿江景观绿地工程",
          "projCont":"滨河路（市新路至新化快速）沿江景观绿地工程位于创新城南岸启动区范围内，西起市新路，沿滨河路向东延伸至新化快速路止，呈带状分布，规划宽度约为80米左右，全长约4.4公里。",
          "agentInvest":null,
          "projInvestment":99192.0000,
          "planDateName":"2020年",
          "planInfo":"3月完成方案设计，6月完成初步设计，9月完成施工图设计，12月底完成概（预）评审。",
          "monitor":"土发中心",
          "planZbdlf":0.0000,
          "planQqgzf":50.0000,
          "planSjf":300.0000,
          "planZdcqf":0.0000,
          "planGxqgf":0.0000,
          "planJlf":0.0000,
          "planJaf":0.0000,
          "planInvest":350.0000,
          "planInterest":0.0000,
          "fundSource":"土发投资项目",
          "planRecZbdlf":null,
          "planRecQqgzf":null,
          "planRecSjf":null,
          "planRecJlf":null,
          "planRecZdcqf":null,
          "planRecJaf":null,
          "planRecGxqgf":null,
          "planRecLx":null,
          "planRecSum":null,
          "yearPlanInfo":"总工室：\n合约部：\n征拆部：\n工程部："
        },
        {
          "projId":13430,
          "projTypeid":22,
          "projName":"500千伏穗西电力隧道（南大干线共建段）工程第6路段",
          "projCont":"线路起于地铁七号线员岗站IIIa号出入口东侧，沿南大干线路中向东穿越南沙港快速向东继续延伸，至市新路规划路口止。电力隧道全长3.574km，其中顶管段长320m，其余均采用明挖。",
          "agentInvest":null,
          "projInvestment":20000.0000,
          "planDateName":"2020年",
          "planInfo":"完成20%主体结构。",
          "monitor":"区交通局",
          "planZbdlf":32.0000,
          "planQqgzf":0.0000,
          "planSjf":0.0000,
          "planZdcqf":0.0000,
          "planGxqgf":0.0000,
          "planJlf":60.0000,
          "planJaf":3000.0000,
          "planInvest":3092.0000,
          "planInterest":0.0000,
          "fundSource":"广州投资项目",
          "planRecZbdlf":null,
          "planRecQqgzf":null,
          "planRecSjf":null,
          "planRecJlf":null,
          "planRecZdcqf":null,
          "planRecJaf":null,
          "planRecGxqgf":null,
          "planRecLx":null,
          "planRecSum":null,
          "yearPlanInfo":"总工室：\n合约部：\n征拆部：\n工程部："
        },
        {
          "projId":13420,
          "projTypeid":22,
          "projName":"展贸东路与东龙大道接驳工程",
          "projCont":"项目起点位于东龙大道延长线龙沙船舶基地码头附近，终点连接展贸东路北边断头路。设双向两车道，采用水泥混凝土路面，全长2.125公里，其中道路约1.555公里，道路宽度为8米；四沙涌大桥桥长525.6米，下部结构按远期规划半幅一次成型（20.5米），上部结构宽度8米，远期再拼接加宽； K2+019中桥桥长44米，下部结构按远期规划半幅一次成型（18.5米），上部结构宽度8米，远期再拼接加宽。",
          "agentInvest":null,
          "projInvestment":14556.0000,
          "planDateName":"2020年",
          "planInfo":"3月完成初步设计，6月完成施工图，8月完成概预算评审，10月完成施工招标。",
          "monitor":"化龙镇政府",
          "planZbdlf":57.0000,
          "planQqgzf":100.0000,
          "planSjf":236.0000,
          "planZdcqf":0.0000,
          "planGxqgf":0.0000,
          "planJlf":0.0000,
          "planJaf":0.0000,
          "planInvest":393.0000,
          "planInterest":0.0000,
          "fundSource":"财局预算项目",
          "planRecZbdlf":null,
          "planRecQqgzf":null,
          "planRecSjf":null,
          "planRecJlf":null,
          "planRecZdcqf":null,
          "planRecJaf":null,
          "planRecGxqgf":null,
          "planRecLx":null,
          "planRecSum":null,
          "yearPlanInfo":"总工室：\n合约部：\n征拆部：\n工程部："
        },
        {
          "projId":13400,
          "projTypeid":22,
          "projName":"龙漖北路（莲江路至莲花大道段）工程",
          "agentInvest":null,
          "projInvestment":2998.0000,
          "planZbdlf":22.0000,
          "planQqgzf":13.0000,
          "planRecZbdlf":null,
          "planRecQqgzf":22.9600,},
        {
          "projId":13390,
          "projTypeid":22,
          "projName":"市桥环线快速化市南路和市良路沿线节点改造工程",
          "agentInvest":null,
          "projInvestment":61222.0000,
          "planZbdlf":53.0000,
          "planQqgzf":40.0000,
          "planRecZbdlf":null,
          "planRecQqgzf":null
        },
        {
          "projId":13570,
          "projTypeid":23,
          "projName":"番禺大道-兴业大道平交和番禺大道-平康路平交改造工程",
          "agentInvest":null,
          "projInvestment":1500.0000,
          "planZbdlf":0.0000,
          "planQqgzf":0.0000,
          "planRecZbdlf":null,
          "planRecQqgzf":null
        },
        {
          "projId":13560,
          "projTypeid":23,
          "projName":"番禺大道维修整治工程",
          "agentInvest":null,
          "planZbdlf":0.0000,
          "planQqgzf":0.0000,
          "planRecZbdlf":null,
          "planRecQqgzf":null
        },
        {
          "projId":13550,
          "projTypeid":23,
          "projName":"番禺大道(市莲路-东环路段)东侧辅道改造工程",
          "agentInvest":null,
          "projInvestment":334.0000,
          "planZbdlf":2.0000,
          "planQqgzf":0.0000,
          "planRecZbdlf":null
        },
        {
          "projId":13590,
          "projTypeid":24,
          "projName":"三善大桥工程",
          "agentInvest":null,
          "projInvestment":26500.0000,
          "monitor":"区交通局",
          "planZbdlf":0.0000,
          "planQqgzf":0.0000,
          "planRecZbdlf":null,
          "planRecQqgzf":null
        },
        {
          "projId":13580,
          "projTypeid":24,
          "projName":"黄埔大桥桥下辅道工程",
          "agentInvest":null,
          "projInvestment":4117.0000,
          "planZbdlf":0.0000,
          "planQqgzf":0.0000,
          "planRecZbdlf":null,
          "planRecQqgzf":null
        },
        {
          "projId":13650,
          "projTypeid":25,
          "projName":"倚莲街工程",
          "agentInvest":null,
          "projInvestment":3699.0000,
          "planZbdlf":0.0000,
          "planQqgzf":0.0000,
          "planRecZbdlf":null,
          "planRecQqgzf":null
        },
        {
          "projId":13640,
          "projTypeid":25,
          "projName":"莲江路工程",
          "agentInvest":null,
          "projInvestment":13266.0000,
          "planZbdlf":0.0000,
          "planQqgzf":0.0000,
          "planRecZbdlf":null,
          "planRecQqgzf":null
        }
      ],
      'success': true
    })
  },
  tableData03: (req) => {
    return Mock.mock({
      'data': [
        {
          "cellCount":0,
          "cellFinishCount":0,
          "children":[
            {
              "cellCount":0,
              "cellFinishCount":0,
              "children":[
                {
                  "cellCount":86,
                  "cellFinishCount":86,
                  "children":[],
                  "parent":4000002,
                  "smIds":"2969,2970,2971,2972,2973,2974,2975,2976,2977,2978,2979,2980,2981,2982,2983,2984,2985,2986,2987,2988,2989,2990,2991,2992,2993,2994,2995,2996,2997,2998,2999",
                  "typeId":4000003,
                  "typeName":"土方路基"
                }
              ],
              "parent":4000001,
              "smIds":null,
              "typeId":4000002,
              "typeName":"路基土石方工程"
            },
            {
              "cellCount":0,
              "cellFinishCount":0,
              "children":[
                {
                  "cellCount":0,
                  "cellFinishCount":0,
                  "children":[
                    {
                      "cellCount":482,
                      "cellFinishCount":265,
                      "children":[],
                      "parent":4000063,
                      "smIds":"12,13,15,21,27,28,51,52,53,62,63,65,71,77,78,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,181,182,183,184,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,254,255,256,259,260,261,284,285,286,289,290,291,293,294,295,296,297,298,299,300,301,302,303,304,305,306,307,308,309,310,311,312,313,314,315,316,317,318,319,320,321,322,323,324,325,326,327,328,329,331,332,333,334,335,336,337,338,339,340,341,342,343,344,345,346,347,348,349,350,373,374,375,376,377,378,379,380,381,382,383,384,385,386,387,388,389,390,391,392,393,394,395,396,397,398,399,400,401,402,403,404,405,406,407,408,409,410,411,412,413,414,415,416,417,418,419,420,421,422,423,424,425,426,427,428,429,430,431,432,433,434,435,436,437,438,439,440,441,442,443,444,445,448,449,450,451,452,453,454,455,456,457,458,459,460,461,462,463,464,465,466,467,468,469,470,471,472,473,474,475,476,477,478,479,480,481,482,483,484,485,486,487,488,489,490,491,492,493,494,495,496,499,500,503,504,507,508,511,512,513,514,515,516,517,518,519,520,521,522,523,524,525,526,527,528,529,530,531,532,533,534,535,536,537,538,539,540,541,542,543,544,545,546,547,548,549,550,551,552,553,554,555,556,557,558,559,560,561,562,563,564,565,566,567,568,569,570,571,572,573,574,575,576,577,578,579,580,581,582,583,584,586,588,590,592,594,596,599,600,601,602,603,604,606,607,609,611,616,617,618,619,620,621,622,623,631,632,634,635,636,637,638,639,640,2938,2939,2941,2943,2947,2953,2956,2964",
                      "typeId":102984,
                      "typeName":"承台等大体积混凝土"
                    },
                    {
                      "cellCount":1174,
                      "cellFinishCount":565,
                      "children":[],
                      "parent":4000063,
                      "smIds":"330,351,352,353,354,355,356,357,358,359,360,361,362,363,364,365,366,367,368,369,370,371,372,2200,2208",
                      "typeId":4000064,
                      "typeName":"钻孔灌注桩"
                    },
                    {
                      "cellCount":40,
                      "cellFinishCount":40,
                      "children":[],
                      "parent":4000063,
                      "smIds":null,
                      "typeId":4000233,
                      "typeName":"混凝土扩大基础"
                    }
                  ],
                  "parent":4000061,
                  "smIds":null,
                  "typeId":4000063,
                  "typeName":"基础"
                },
                {
                  "cellCount":0,
                  "cellFinishCount":0,
                  "children":[
                    {
                      "cellCount":0,
                      "cellFinishCount":0,
                      "children":[
                        {
                          "cellCount":984,
                          "cellFinishCount":481,
                          "children":[],
                          "parent":102986,
                          "smIds":"16,17,18,23,24,67,68,73,74,625,626,627,628,629,630,641,642,2202,2210",
                          "typeId":102987,
                          "typeName":"现浇墩、台身"
                        },
                        {
                          "cellCount":333,
                          "cellFinishCount":221,
                          "children":[],
                          "parent":102986,
                          "smIds":"4,5,6,7,8,9,10,11,14,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,54,55,56,57,58,59,60,61,64,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,179,180,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,252,253,257,258,262,263,446,447,497,498,501,502,505,506,509,510,605,633,2275,2392,2703,2704,2705,2706,2711,2712,2721,2722,2763,2764,2767,2768,2771,2772,2803,2804,2807,2808,2812,2814,2815,2816,2823,2824,2849,2850,2855,2856,2861,2862,2867,2868,2871,2872,2875,2876,2881,2882,2886,2888,2890,2892,2894,2896,2898,2900,2902,2904,2906,2908,2910,2912,2914,2916,2925,2932,2934,2935,2936,2940,2942,2946,2949,2951,2952,2955,2963",
                          "typeId":102988,
                          "typeName":"现浇墩、台帽或盖梁"
                        }
                      ],
                      "parent":4000105,
                      "smIds":null,
                      "typeId":102986,
                      "typeName":"混凝土墩、台"
                    }
                  ],
                  "parent":4000061,
                  "smIds":null,
                  "typeId":4000105,
                  "typeName":"混凝土墩、台"
                },
                {
                  "cellCount":0,
                  "cellFinishCount":0,
                  "children":[
                    {
                      "cellCount":0,
                      "cellFinishCount":0,
                      "children":[
                        {
                          "cellCount":440,
                          "cellFinishCount":0,
                          "children":[],
                          "parent":102990,
                          "smIds":"2251,2252,2253,2254,2255,2256,2257,2258,2259,2260,2261,2262,2263,2264,2265,2266,2267,2268,2269,2270,2271,2272,2273,2274,2276,2277,2278,2279,2280,2281,2282,2283,2284,2285,2286,2287,2288,2289,2290,2291,2292,2293,2294,2295,2296,2297,2298,2299,2300,2301,2302,2303,2304,2305,2306,2307,2308,2309,2310,2311,2312,2313,2314,2315,2316,2317,2318,2319,2320,2321,2322,2323,2324,2325,2326,2327,2328,2329,2330,2331,2332,2333,2334,2335,2336,2337,2338,2339,2340,2341,2342,2343,2344,2345,2346,2347,2348,2349,2350,2351,2352,2353,2354,2355,2356,2357,2358,2359,2360,2361,2362,2363,2364,2365,2366,2367,2368,2369,2370,2371,2372,2373,2374,2375,2376,2377,2378,2379,2380,2381,2382,2383,2384,2385,2386,2387,2388,2389,2390,2391,2393,2394,2395,2396,2397,2398,2399,2400,2401,2402,2403,2404,2405,2406,2407,2408,2409,2410,2411,2412,2413,2414,2415,2416,2417,2418,2419,2420,2421,2422,2423,2424,2425,2426,2427,2428,2429,2430,2431,2432,2433,2434,2435,2436,2437,2438,2439,2440,2441,2442,2443,2444,2445,2446,2447,2448,2449,2450,2451,2452,2453,2454,2455,2456,2457,2458,2459,2460,2461,2462,2463,2464,2465,2466,2467,2468,2469,2470,2471,2472,2473,2474,2475,2476,2477,2478,2479,2480,2481,2482,2483,2484,2491,2492,2493,2494,2495,2496,2497,2498,2499,2500,2501,2502,2503,2504,2505,2506,2507,2508,2509,2510,2511,2512,2513,2514,2515,2516,2517,2518,2519,2520,2521,2522,2523,2524,2525,2526,2527,2528,2529,2530,2531,2532,2533,2534,2535,2536,2537,2538,2539,2540,2541,2542,2543,2544,2545,2546,2547,2548,2549,2550,2551,2552,2553,2554,2555,2556,2557,2558,2559,2560,2561,2562,2563,2564,2565,2566,2567,2568,2569,2570,2571,2572,2573,2574,2575,2576,2577,2578,2579,2580,2581,2582,2583,2584,2585,2586,2587,2588,2589,2590,2591,2592,2593,2594,2595,2596,2597,2598,2599,2600,2601,2602,2603,2604,2605,2606,2607,2608,2609,2610,2611,2612,2613,2614,2615,2616,2617,2618,2619,2620,2621,2622,2623,2624,2625,2626,2627,2628,2629,2630,2631,2632,2633,2634,2635,2636,2637,2638,2639,2640,2641,2642,2643,2644,2645,2646,2647,2648,2649,2650,2651,2652,2653,2654,2655,2656,2657,2658,2659,2660,2661,2662,2663,2664,2665,2666,2667,2668,2669,2670,2671,2672,2673,2674,2675,2676,2677,2678,2679,2680,2681,2682,2683,2684,2685,2686,2687,2688,2689,2690,2691,2692,2693,2694,2695,2696,2697,2698",
                          "typeId":102991,
                          "typeName":"梁、板或梁段预制"
                        }
                      ],
                      "parent":4000106,
                      "smIds":null,
                      "typeId":102990,
                      "typeName":"预制安装梁、板"
                    },
                    {
                      "cellCount":0,
                      "cellFinishCount":0,
                      "children":[
                        {
                          "cellCount":6,
                          "cellFinishCount":6,
                          "children":[],
                          "parent":102994,
                          "smIds":"2485,2486,2487,2488,2489,2490",
                          "typeId":102995,
                          "typeName":"悬臂浇筑梁"
                        }
                      ],
                      "parent":4000106,
                      "smIds":null,
                      "typeId":102994,
                      "typeName":"悬臂施工梁"
                    },
                    {
                      "cellCount":80,
                      "cellFinishCount":76,
                      "children":[],
                      "parent":4000106,
                      "smIds":"2715,2716,2717,2718,2719,2720,2777,2778,2779,2780,2781,2782,2795,2796,2797,2798,2799,2800,2802,2811,2813,2817,2818,2819,2820,2821,2822,2825,2826,2827,2828,2829,2830,2831,2832,2839,2840,2841,2842,2843,2844,2845,2846,2847,2848,2851,2852,2853,2854,2857,2858,2859,2860,2865,2866,2877,2878,2879,2880,2883,2884,2921,2922,2923,2924,2926,2927,2928,2929,2944,2945,2957,2958,2959,2960,2961,2962",
                      "typeId":4000248,
                      "typeName":"就地浇筑梁、板"
                    }
                  ],
                  "parent":4000061,
                  "smIds":null,
                  "typeId":4000106,
                  "typeName":"混凝土梁桥"
                },
                {
                  "cellCount":0,
                  "cellFinishCount":0,
                  "children":[
                    {
                      "cellCount":6,
                      "cellFinishCount":6,
                      "children":[],
                      "parent":4000261,
                      "smIds":null,
                      "typeId":4000266,
                      "typeName":"钢梁安装"
                    }
                  ],
                  "parent":4000061,
                  "smIds":null,
                  "typeId":4000261,
                  "typeName":"钢桥"
                },
                {
                  "cellCount":0,
                  "cellFinishCount":0,
                  "children":[
                    {
                      "cellCount":0,
                      "cellFinishCount":0,
                      "children":[
                        {
                          "cellCount":16,
                          "cellFinishCount":0,
                          "children":[],
                          "parent":103033,
                          "smIds":null,
                          "typeId":103034,
                          "typeName":"支座垫石"
                        },
                        {
                          "cellCount":11,
                          "cellFinishCount":0,
                          "children":[],
                          "parent":103033,
                          "smIds":"19,20,22,25,26,66,69,70,72,75,76",
                          "typeId":103035,
                          "typeName":"挡块"
                        }
                      ],
                      "parent":4000299,
                      "smIds":null,
                      "typeId":103033,
                      "typeName":"支座垫石和挡块"
                    }
                  ],
                  "parent":4000061,
                  "smIds":null,
                  "typeId":4000299,
                  "typeName":"桥面系和附属工程"
                }
              ],
              "parent":4000001,
              "smIds":null,
              "typeId":4000061,
              "typeName":"桥梁工程"
            }
          ],
          "parent":0,
          "smIds":null,
          "typeId":4000001,
          "typeName":"2017公路工程质量检验评定标准(土建工程)"
        }
      ],
      'success': true
    })
  },

  treeData01: (req) => {
    return Mock.mock({
      'data': [
        {
          "projId":13110,
          "fileName":"代理单位",
          "kid":"f0a83028-5b59-4786-a024-8c46538701ec",
          "fileCount":0,
          "children":[
            {
              "projId":13110,
              "fileName":"合约部",
              "kid":"512da700-ee98-4913-b002-84c3a5d6d3bd",
              "fileCount":0,
              "children":[
                {
                  "projId":13110,
                  "fileName":"施工招标-中标通知书",
                  "kid":"c3df6096-ba52-46b9-a57b-40a209cf8da5",
                  "fileCount":2,
                  "children":[],
                  "fileList":"中标通知书",
                  "leaf":true
                },
                {
                  "projId":13110,
                  "fileName":"施工招标-招标资料汇总",
                  "kid":"fe4678b8-1b4e-4d9f-a733-be0baa518bf6",
                  "addUnitName":"广州市番禺建设管理有限公司",
                  "fileCount":1,
                  "children":[],
                  "limit":10
                }
              ]
            }
          ]
        },
        {
          "projId":13110,
          "fileName":"第三方评审项目-结算评审结果",
          "kid":"7e503ed8-e94b-459a-8110-fec198a7c42b",
          "fileCount":0,
          "children":[]
        },
        {
          "projId":13110,
          "fileName":"监理-合同",
          "kid":"a8a8e5d5-2805-4821-b942-2c4ddb7eba57",
          "fileCount":0,
          "children":[],
        },
        {
          "projId": 13110,
          "fileName": "施工单位",
          "kid": "faeb3d1b-61ad-42fb-94c3-2d9e36874e65",
          "fileCount": 0,
          "children": [
            {
              "projId": 13110,
              "fileName": "工程管理部",
              "kid": "387f7cd3-ca6b-4f04-b843-242148fcfb29",
              "fileCount": 0,
              "children": [
                {
                  "projId": 13110,
                  "fileName": "开工令",
                  "kid": "bde31a6e-dd7d-4b79-9401-e3557532f369",
                  "fileCount": 0,
                  "children": [
                    {
                      "projId": 13110,
                      "fileName": "标段一",
                      "kid": "d38600fc-0cc0-433a-98a2-088fbf05250d",
                      "fileCount": 0
                    },
                    {
                      "projId": 13110,
                      "fileName": "标段二",
                      "kid": "fa7bbf96-0be8-452c-82bd-380482ae03b5",
                      "fileCount": 0,
                      "children": [],
                    }
                  ]
                }
              ]
            }
          ]
        }
        ],
      'success': true
    })
  }
}

