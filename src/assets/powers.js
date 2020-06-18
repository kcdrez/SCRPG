export default [
  {
    id: 'accident',
    label: 'Accident',
    powers: {
      categories: ['Athletic', 'Elemental/Energy', 'Intellectual', 'Materials', 'Psychic', 'Self Control'],
      list: []
    },
    abilities: {
      green: {
        count: 1,
        list: [{
          actions: ['Defend'],
          name: 'Ambush Awareness',
          type: 'Reaction',
          description: 'If you haven’t yet acted in an action scene, you may Defend against an Attack by rolling your single [power] die.'
        },
        {
          actions: ['Boost'],
          name: 'Change in Circumstance',
          type: 'Reaction',
          description: 'When you change personal zones, you may Boost by rolling your single [power] die.'
        },
        {
          actions: [],
          name: 'Immunity',
          type: 'Inherent',
          description: 'You do not take damage from [energy/element]'
        }]
      },
      yellow: {
        count: 2,
        list: [{
          actions: ['Boost', 'Hinder'], //todo: does the player choose this now, or in game?
          name: 'Area Alteration',
          type: 'Action',
          description: '[Boost or Hinder] any number of nearby targets using [power]. Use your Max die.'
        },
        {
          actions: ['Attack', 'Hinder'],
          name: 'Inflict',
          type: 'Action',
          description: 'Attack using [power]. Hinder that same target using your Min die.'
        },
        {
          actions: ['Attack'],
          name: 'Reflexive Burst',
          type: 'Reaction',
          description: 'When you change personal zones, Attack all close enemy targets by rolling your single [power] die.'
        }]
      }
    },
    description: 'An external source caused you to manifest powers or perhaps the cure for an accident caused it.',
    archetype: [12, 6]
  },
  {
    id: 'training',
    label: 'Training',
    powers: {
      categories: ['Athletic', 'Intellectual'],
      list: ['Gadgets', 'Signature Vehicle', 'Signature Weaponry']
    },
    abilities: {
      yellow: {
        count: 2,
        list: [{
          actions: ['Boost', 'Attack'],
          name: 'Always Be Prepared',
          type: 'Action',
          description: 'Boost yourself using [power]. That bonus is persistent and exclusive. Then, Attack using your Min die. You may use the bonus you just created on that Attack.'
        },
        {
          actions: [],
          name: 'Reactive Field',
          type: 'Reaction',
          description: 'When you are attacked by a nearby enemy, the attacker also takes an equal amount of damage.'
        },
        {
          actions: ['Attack'],
          name: 'Flowing Fight',
          type: 'Action',
          description: 'Attack using [power]. Use your Mid die to Attack one extra target for each bonus you have. Apply a different bonus to each Attack.'
        }]
      }
    },
    description: 'The source of your powers is the result of your hard work, dedication, and long hours.',
    archetype: [10, 8, 8],
    extras: 'Extra quality from archetype at d8' //todo: how to handle this
  },
  {
    id: 'genetic',
    label: 'Genetic',
    powers: {
      categories: ['Intellectual', 'Psychic'],
      list: ['Agility', 'Flight', 'Signature Weaponry', 'Strength', 'Vitality']
    },
    abilities: {
      green: {
        count: 1,
        list: [{
          actions: ['Boost'],
          name: 'Growth',
          type: 'Action',
          description: 'Boost yourself using [quality]. That bonus is persistent and exclusive.'
        },
        {
          actions: ['Attack', 'Recover'],
          name: 'Rally',
          type: 'Action',
          description: 'Attack using [quality]. Other nearby heroes in the Yellow or Red zone Recover equal to your Min die.'
        }]
      },
      yellow: {
        count: 2,
        list: [{
          actions: ['Defend'],
          name: 'Danger Sense',
          type: 'Reaction',
          description: 'When damaged by an environment target or a surprise Attack, Defend by rolling your single [power] die.'
        },
        {
          actions: ['Boost', 'Recover'],
          name: 'Adaptive',
          type: 'Action',
          description: 'Boost yourself using [power], then either remove a penalty on yourself or Recover using your Min die.'
        },
        {
          actions: ['Attack'],
          name: 'Area Assault',
          type: 'Action',
          description: 'Attack multiple targets using [power], using your Min die against each.'
        }]
      }
    },
    description: 'Mutations in your DNA have caused you to develop unusual abilities.',
    archetype: [10, 8, 8]
  },
  {
    id: 'experimentation',
    label: 'Experimentation',
    powers: {
      categories: ['Atheltic', 'Elemental/Energy', 'Intellectual', 'Mobility', 'Self Control'],
      list: ['Signature Weaponry']
    },
    abilities: {
      green: {
        count: 1,
        list: [{
          actions: [],
          name: 'Overpower',
          type: 'Inherent',
          description: 'Whenever you are Boosted, increase that bonus by +1. Then, if that bonus is +5 or higher, take damage equal to that bonus and remove it.'
        },
        {
          actions: [],
          name: 'Unflagging',
          type: 'Inherent',
          description: 'At the start of your turn, remove a penalty on yourself.'
        }]
      },
      yellow: {
        count: 2,
        list: [{
          actions: ['Boost'],
          name: 'Personal Upgrade',
          type: 'Action',
          description: 'Boost yourself using [power]. Use your Max die. That bonus is persistent and exclusive.'
        },
        {
          actions: ['Defend'],
          name: 'Misdirection',
          type: 'Reaction',
          description: 'When a nearby hero in the Yellow or Red zone would take damage, Defend against that damage by rolling your single [power] die, then redirect any remaining damage to a nearby minion of your choice.'
        },
        {
          actions: ['Attack'],
          name: 'Throw Minion',
          type: 'Action',
          description: 'Attack a minion using [power]. The result of the minion’s save Attacks another target of your choice.'
        }]
      }
    },
    description: 'Your powers were created in a lab and had some unexpected side effects.',
    archetype: [8, 8, 8]
  },  
  {
    id: 'mystical',
    label: 'Mystical',
    powers: {
      categories: ['Elemental/Energy', 'Materials', 'Psychic', 'Self Control'],
      list: ['Awareness', 'Flight', 'Presence', 'Signature Weaponry', 'Teleportation']
    },
    abilities: {
      yellow: {
        count: 2,
        list: [{
          actions: ['Boost', 'Hinder'],
          name: 'Modification Wave',
          type: 'Action',
          description: 'Boost or Hinder using [power], and apply that mod against multiple nearby targets.'
        },
        {
          actions: ['Defend'],
          name: 'Mystic Redirection',
          type: 'Reaction',
          description: 'When another hero in the Yellow or Red zone would take damage, you may redirect it to yourself and Defend against it by rolling your single [power] die.'
        },
        {
          actions: ['Overcome', 'Boost'],
          name: 'Sever Link',
          type: 'Action',
          description: 'Overcome an environmental challenge using [power]. Use your Max die. Either remove any penalty in the scene or Boost equal to your Mid die.'
        }]
      }
    },
    description: 'Your magical training or alteration by magic gives you your powers.',
    archetype: [10, 8, 8],
    extras: 'Gain Information quality with d10'
  },  
  {
    id: 'nature',
    label: 'Nature',
    powers: {
      categories: ['Athletic', 'Materials'],
      list: ['Animal Control', 'Cold', 'Electricity', 'Fire', 'Flight', 'Leaping', 'ShapeShifting', 'Swimming', 'Swinging', 'Wall-Crawling', 'Weather']
    },
    abilities: {
      green: {
        count: 1,
        list: [{
          actions: ['Hinder'],
          name: 'Grasping Vines',
          type: 'Action',
          description: 'Hinder using [power]. Use your Max die. You may split that penalty across multiple nearby targets.'
        },
        {
          actions: ['Attack'],
          name: 'Natural Weapon',
          type: 'Action',
          description: 'Attack using [power]. Use your Max die.'
        }]
      },
      yellow: {
        count: 2,
        list: [{
          actions: [],
          name: 'Call to the Wild',
          type: 'Action',
          description: 'Gain a d8 minion. It takes its turn before yours, but goes away at the end of the scene. You may only have one such minion at a time.'
        },
        {
          actions: ['Attack', 'Boost'],
          name: 'Predator\'s Eye',
          type: 'Action',
          description: 'Attack using [power]. Using your Max+Min dice. Then gain a Boost using your Mid die. The target of the Attack gains a Boost of the same size.'
        },
        {
          actions: ['Boost'],
          name: 'Wild Strength',
          type: 'Reaction',
          description: 'When you defeat a minion, roll that minion’s die and Boost yourself using that roll to create a bonus for your next action.'
        }]
      }
    },
    description: 'The power of nature flows through you.',
    archetype: [10, 8, 8]
  },
  {
    id: 'relic',
    label: 'Relic',
    powers: {
      categories: ['Elemental/Energy', 'Materials', 'Mobility', 'Psychic', 'Self Control'],
      list: ['Awareness', 'Intuition', 'Signature Vehicle', 'Signature Weaponry']
    },
    abilities: {
      green: {
        count: 1,
        list: [{
          actions: ['Boost'],
          name: 'Draw Power',
          type: 'Action',
          description: 'Boost yourself using [power]. That bonus is persistent and exclusive.'
        },
        {
          actions: [],
          name: 'Punishment',
          type: 'Inherent',
          description: 'Whenever you Attack an enemy that has inflicted a penalty on you, treat that penalty as if it were a bonus for the purpose of that Attack.'
        }]
      },
      yellow: {
        count: 2,
        list: [{
          actions: ['Attack', 'Recover'],
          name: 'Harvest Life Force',
          type: 'Action',
          description: 'Attack using [power]. Use your Min die. Take damage equal to your Mid die, and one nearby ally Recovers Health equal to your Max die.'
        },
        {
          actions: ['Defend'],
          name: 'Magical Shield',
          type: 'Reaction',
          description: 'When another hero in the Yellow or Red zone would take damage, you may Defend them by rolling your single [power] die.'
        },
        {
          actions: ['Boost', 'Hinder'],
          name: 'Momentary Power',
          type: 'Action',
          description: 'Boost yourself using [power]. Use your Max die. Hinder a nearby opponent with your Min die.'
        },
        {
          actions: ['Hinder', 'Recover'],
          name: 'Relic Drain',
          type: 'Action',
          description: 'Hinder using [power]. Recover Health equal to your Min die.'
        }]
      }
    },
    description: 'An object (or collection of objects) of mystical significance either grants you powers or altered you to give you powers.',
    archetype: [10, 10, 6]
  },
  {
    id: 'poweredSuit',
    label: 'Powered Suit',
    powers: {
      categories: ['Athletic', 'Mobility'],
      list: ['Awareness', 'Cold', 'Elasticity', 'Electricity', 'Fire', 'Lightning Calculator', 'Nuclear', 'Part Detachment', 'Signature Vehicle', 'Signature Weaponry'],
      required: ['Power Suit']
    },
    abilities: {
      green: {
        count: 1,
        list: [{
          actions: [],
          name: 'Damage Reduction',
          type: 'Inherent',
          description: 'Reduce [physical or energy] damage you take by 1 while you are in the Green zone, 2 while in the Yellow zone, and 3 while in the Red zone.' //todo: handle this choice
        },
        {
          actions: [],
          name: 'Diagnostic Subroutine',
          type: 'Inherent',
          description: 'Whenever your status changes due to a change in your current Health, you may remove a penalty on yourself.'
        }]
      },
      yellow: {
        count: 2,
        list: [{
          actions: ['Boost'],
          name: 'Energy Converter',
          type: 'Reaction',
          description: 'When you take damage from [element/energy], gain a bonus equal to that amount of damage.'
        },
        {
          actions: ['Attack'],
          name: 'Explosive Attack',
          type: 'Action',
          description: 'Attack up to three different targets using [power]. Apply your Max die to one, your Mid die to another, and your Min die to the third. If you roll doubles, take a minor twist or take irreducible damage equal to that die.'
        },
        {
          actions: ['Boost'],
          name: 'Onboard Upgrade',
          type: 'Action',
          description: 'Boost yourself using Power Suit. Use your Min+Mid dice. That bonus is persistent and exclusive.'
        }]
      }
    },
    description: 'An engineered suit provides you with your powers, and may even be important to keeping you alive.',
    archetype: [10, 6, 6]
  }, 
  {
    id: 'radiation',
    label: 'Radiation',
    powers: {
      categories: ['Athletic', 'Self Control', 'Technological'],
      list: ['Nuclear', 'Signature Vehicle', 'Signature Weaponry']
    },
    abilities: {
      green: {
        count: 1,
        list: [{
          actions: [],
          name: 'Charged Up',
          type: 'Inherent',
          description: 'Whenever you roll a 1 on one or more dice, you may reroll those dice. You must accept the result of the reroll.'
        },
        {
          actions: ['Attack'],
          name: 'Dangerous Lash',
          type: 'Action',
          description: 'Attack multiple targets using [power], applying your Min die to each. If you roll doubles, also attack an ally using your Mid die.'
        },
        {
          actions: ['Attack'],
          name: 'Radioactive Aura',
          type: 'Reaction',
          description: 'When a new target enters the scene close to you, you may Attack it by rolling your single [power] die.'
        }]
      },
      yellow: {
        count: 2,
        list: [{
          actions: ['Boost', 'Recover'],
          name: 'Radioactive Recharge',
          type: 'Action',
          description: 'Boost yourself using [power]. Then, either remove a penalty on yourself or recover using your Min die.'
        },
        {
          actions: [],
          name: 'Unstable Reaction',
          type: 'Reaction',
          description: 'Attack using [power]. Hinder that target using your Max die.'
        }]
      }
    },
    description: 'Exposure to radiation has charged your system and given you new abilities.',
    archetype: [10, 8, 6]
  }, 
  {
    id: 'techUpgrades',
    label: 'Tech Upgrades',
    powers: {
      categories: ['Athletic', 'Elemental/Energy', 'Intellectual', 'Mobility', 'Technological'],
      list: ['Signature Vehicle', 'Signature Weaponry']
    },
    abilities: {
      green: {
        count: 1,
        list: [{
          actions: ['Boost'],
          name: 'Indiscriminate Fabrication',
          type: 'Action',
          description: 'Boost using [power], assigning your Min, Mid, and Max dice to 3 different bonuses, one of which must be given to an enemy.'
        },
        {
          actions: ['Attack', 'Hinder'],
          name: 'Organi-Hack',
          type: 'Action',
          description: 'Attack a target using [power]. Hinder that target with your Min die.'
        }]
      },
      yellow: {
        count: 2,
        list: [{
          actions: ['Attack'],
          name: 'Energy Burst',
          type: 'Action',
          description: 'Attack multiple targets using [power], using your Min die against each.'
        },
        {
          actions: ['Boost', 'Recover'],
          name: 'Recharge',
          type: 'Action',
          description: 'Boost yourself using [power]. Then, either remove a penalty on yourself or Recover using your Min die.'
        },
        {
          actions: ['Recover'],
          name: 'Techno-Absorb',
          type: 'Inherent',
          description: 'If you would take damage from [element/energy you have a related power for], instead reduce that damage to 0 and Recover that amount of Health instead.'
        },
        {
          actions: ['Boost'],
          name: 'Tactical Analysis',
          type: 'Reaction',
          description: 'When Attacked, treat the amount of damage you take as a Boost action for yourself.'
        }]
      }
    },
    description: 'You have technological upgrades and implants that give you your power',
    archetype: [10, 10, 8]
  },   
  {
    id: 'supernatural',
    label: 'Supernatural',
    powers: {
      categories: ['Mobility', 'Psychic', 'Self Control'],
      list: ['Awareness', 'Cold', 'Electricity', 'Fire', 'Infernal', 'Plants', 'Radiant', 'Presence', 'Strength', 'Transmutation', 'Vitality', 'Weather']
    },
    abilities: {
      yellow: {
        count: 2,
        list: [{
          actions: ['Boost', 'Recover'],
          name: 'Area Healing',
          type: 'Action',
          description: 'Boost an ally using [power]. You and nearby heroes in the Yellow and Red zones Recover Health equal to your Min die.'
        },
        {
          actions: ['Boost', 'Hinder'],
          name: 'Mass Modification',
          type: 'Action',
          description: 'Boost or Hinder using [power], and apply that mod to multiple close targets.'
        },
        {
          actions: ['Boost'],
          name: 'Personal Upgrade',
          type: 'Action',
          description: 'Boost yourself using [power]. Use your Max die. That bonus is persistent and exclusive.'
        },
        {
          actions: ['Defend'],
          name: 'Reach through Veil',
          type: 'Reaction',
          description: 'When a nearby ally would take damage, Defend that ally by rolling your single status die, and move them elsewhere in the same scene.'
        }]
      }
    },
    description: 'In some way, you have pierced the veil of life and reality and brought back power.',
    archetype: [10, 10, 6],
    extras: 'Gain one power not in the list as d10'
  },   
  {
    id: 'artificialBeing',
    label: 'Artificial Being',
    powers: {
      categories: ['Athletic', 'Elemental/Energy', 'Intellectual', 'Mobility', 'Self Control'],
      list: ['Invensions', 'Robotics', 'Signature Vehicle', 'Signature Weaponry']
    },
    abilities: {
      green: {
        count: 1,
        list: [{
          actions: [],
          name: 'Created Form',
          type: 'Inherent',
          description: 'Reduce physical damage to yourself by 1 while you are in the Green zone, 2 while in the Yellow zone, and 3 while in the Red zone.'
        },
        {
          actions: [],
          name: 'Intentionality',
          type: 'Inherent',
          description: 'Whenever you roll a 1 on one or more dice, you may reroll those dice. You must accept the result of the reroll.'
        }]
      },
      yellow: {
        count: 2,
        list: [{
          actions: ['Recover'],
          name: 'Created Immunity',
          type: 'Inherent',
          description: 'When you would take damage from [element/energy], you may Recover that amount of Health instead.'
        },
        {
          actions: ['Attack'],
          name: 'Multiple Assault',
          type: 'Action',
          description: 'Attack using [power] against multiple targets, using your Min die against each.'
        },
        {
          actions: [],
          name: 'Recalculating',
          type: 'Reaction',
          description: 'After rolling during your turn, you may take 1 irreducible damage to reroll your entire dice pool.'
        }]
      }
    },
    description: 'You were created, not born, and your abilities simply stem from your makeup.',
    archetype: [10, 8, 8]
  },  
  {
    id: 'cursed',
    label: 'Cursed',
    powers: {
      categories: ['Athletic', 'Elemental/Energy', 'Materials', 'Self Control'],
      list: ['Signature Weaponry']
    },
    abilities: {
      green: {
        count: 1,
        list: [{
          actions: [],
          name: 'Double Edged Luck',
          type: 'Inherent',
          description: 'Whenever you roll a 1 on one or more dice, you may reroll those dice. You must accept the result of the reroll.'
        },
        {
          actions: [],
          name: 'Extremes',
          type: 'Inherent',
          description: 'Whenever you roll a die’s max value, treat that value as 1 higher. When you roll a 1 on a die, treat that die as if it had rolled a 0.'
        }]
      },
      yellow: {
        count: 2,
        list: [{
          actions: ['Recover'],
          name: 'Attunement',
          type: 'Inherent',
          description: 'When you would take damage from [element/energy], you may Recover that amount of Health instead.'
        },
        {
          actions: ['Boost', 'Hinder'],
          name: 'Costly Strength',
          type: 'Action',
          description: 'Boost all nearby allies using [power]. Use your Max+Mid dice. Hinder yourself with your Min die.'
        },
        {
          actions: ['Boost', 'Recover'],
          name: 'Cursed Resolve',
          type: 'Action',
          description: 'Boost yourself using [power]. Then, either remove a penalty on yourself or Recover using your Min die.'
        }]
      }
    },
    description: 'A supernatural curse has been inflicted upon you and/or your family line, granting both boons and banes.',
    archetype: [12, 6]
  },
  {
    id: 'alien',
    label: 'Alien',
    powers: {
      categories: ['Athletic', 'Elemental/Energy', 'Intellectual', 'Mobility', 'Psychic', 'Technological'],
      list: ['Signature Vehicle', 'Signature Weaponry']
    },
    abilities: {
      yellow: {
        count: 2,
        list: [{
          actions: ['Boost', 'Hinder'],
          name: 'Alien Boost',
          type: 'Action',
          description: 'Boost all nearby allies using [power]. Use your Max+Mid dice. Hinder yourself with your Min die.'
        },
        {
          actions: ['Boost', 'Hinder', 'Defend', 'Attack', 'Recover'],
          name: 'Empower and Repair',
          type: 'Action',
          description: 'Boost, Hinder, Defend, or Attack using [power]. You and all nearby heroes in the Yellow or Red zone Recover Health equal to your Min die.'
        },
        {
          actions: ['Defend'],
          name: 'Halt',
          type: 'Reaction',
          description: 'When you are Attacked at close range, Defend yourself by rolling your single [power] die.'
        }]
      }
    },
    description: 'You are not from Earth, though your powers might not be all that unusual where you come from. Or you’ve been granted abilities by an extraterrestrial source.',
    archetype: [8, 8, 8],
    extras: 'Upgrade a d6 power to d8. If you have none, add a new power from the above list at d6'
  }, 
  {
    id: 'genius',
    label: 'Genius',
    powers: {
      categories: ['Intellectual'],
      list: ['Inventions', 'Robotics', 'Signature Vehicle', 'Signature Weaponry']
    },
    abilities: {
      yellow: {
        count: 2,
        list: [{
          actions: ['Boost', 'Defend'],
          name: 'A Plan for Everything',
          type: 'Reaction',
          description: 'When you are attacked, first roll your single [power] die. Defend yourself with that roll. Then, Boost yourself using that roll.'
        },
        {
          actions: ['Boost', 'Attack'],
          name: 'Expanded Mind',
          type: 'Action',
          description: 'Boost yourself using [power]. Use your Max die. That bonus is persistent and exclusive. Then Attack using your Min die.'
        },
        {
          actions: ['Attack', 'Recover'],
          name: 'Overwhelming Vision',
          type: 'Action',
          description: 'Attack using [power]. Then, if the target of the Attack survived, also Attack that target with your Max die. Otherwise, Recover an amount of Health equal to your Min die.'
        }]
      }
    },
    description: 'The source of your powers is your brilliant mind. You have put your staggering intellect to the task of fighting crime.',
    archetype: [10, 6, 6],
    extras: 'Extra quality from Information or Mental categories at d10'
  },
  {
    id: 'cosmos',
    label: 'Cosmos',
    powers: {
      categories: ['Mobility', 'Psychic', 'Self Control', 'Technological'],
      list: ['Cosmic', 'Intuition', 'Signature Vehicle', 'Signature Weaponry']
    },
    abilities: {
      yellow: {
        count: 2,
        list: [{
          actions: ['Recover'],
          name: 'Cosmic Ray Absorption',
          type: 'Inherent',
          description: 'If you would take damage from [element/energy you have a related power for], instead reduce that damage to 0 and Recover that amount of Health instead.'
        },
        {
          actions: ['Attack', 'Boost'],
          name: 'Encourage',
          type: 'Action',
          description: 'Attack using [power]. Boost all nearby heroes taking Attack or Overcome actions using your Min die until your next turn.'
        },
        {
          actions: ['Boost', 'Hinder'],
          name: 'Mass Adjust',
          type: 'Action',
          description: 'Boost or Hinder using [power] and apply that mod against multiple close targets.'
        }]
      }
    },
    description: 'Exposure to forces from beyond the stars have changed you.',
    archetype: [10, 8, 8],
    extras: 'Downgrade one d8, d10, or d12 power and upgrade one d6, d8, or d10 power'
  },  
  {
    id: 'extraDimentional',
    label: 'Extra Dimentional',
    powers: {
      categories: ['Intellectual', 'Psychic'],
      list: ['Cosmic', 'Duplication', 'Infernal', 'Intangibility', 'Invisibility', 'Radiant', 'Signature Vehicle', 'Signature Weaponry', 'Transmutation', 'Teleportation']
    },
    abilities: {
      green: {
        count: 1,
        list: [{
          actions: ['Boost'],
          name: 'Attune',
          type: 'Action',
          description: 'Boost yourself using [power]. That bonus is persistent and exclusive. Damage dealt using that bonus is all [energy/element].'
        },
        {
          actions: ['Defend'],
          name: 'Extrasensory Awareness',
          type: 'Reaction',
          description: 'When you would take damage that would change your zone, Defend against that damage by rolling your single [quality] die.'
        }]
      },
      yellow: {
        count: 2,
        list: [{
          actions: ['Boost'],
          name: 'Absorb Essence',
          type: 'Reaction',
          description: 'When you defeat a minion, roll that minion’s die and Boost yourself using that roll.'
        },
        {
          actions: ['Attack'],
          name: 'Aura of Pain',
          type: 'Action',
          description: 'Attack multiple targets using [power]. Then, take irreducible damage equal to the number of targets hit.'
        },
        {
          actions: ['Attack', 'Hinder'],
          name: 'Bizarre Strike',
          type: 'Action',
          description: 'Attack using [power]. Use your Max die. Hinder that target with your Mid die. Hinder yourself with your Min die.'
        }]
      }
    },
    description: 'Exposure to side dimensions like the Realm of Discord has left its mark on you.',
    archetype: [12, 6]
  },   
  {
    id: 'unknown',
    label: 'Unknown',
    powers: {
      categories: ['Elemental/Energy', 'Intellectual', 'Materials', 'Self Control', 'Technological'],
      list: []
    },
    abilities: {
      yellow: {
        count: 2,
        list: [{
          actions: ['Attack', 'Boost'],
          name: 'Brainstorm',
          type: 'Action',
          description: 'Attack using [power]. Hit one target using your Min die, another target with your Mid die, and Boost using your Max die. When you defeat a minion, roll that minion’s die and Boost yourself using that roll.'
        },
        {
          actions: ['Boost', 'Hinder'],
          name: 'Strange Enhancement',
          type: 'Action',
          description: 'Boost all nearby allies using [power] using your Max+Mid dice. Hinder yourself with your Min die.'
        },
        {
          actions: ['Attack'],
          name: 'Volatile Creations',
          type: 'Reaction',
          description: 'When one of your bonuses, penalties, or other creation of your powers is destroyed, deal a target damage equal to the roll of your [power] die.'
        }]
      }
    },
    description: 'You don’t know the source of your powers: they either just manifested one day, or hint at a bigger mystery.',
    archetype: [10, 8, 6],
    extras: 'Gain a Social quality at d8'
  },  
  {
    id: 'higherPower',
    label: 'Higher Power',
    powers: {
      categories: ['Athletic', 'Elemental/Energy', 'Materials', 'Psychic', 'Self Control'],
      list: []
    },
    abilities: {
      green: {
        count: 1,
        list: [{
          actions: [],
          name: 'Resilience',
          type: 'Inherent',
          description: 'At the start of your turn, remove any -1 penalties on you.'
        },
        {
          actions: [],
          name: 'Twist Reality',
          type: 'Reaction',
          description: 'After rolling during your turn, you may take 1 damage to reroll your entire dice pool.'
        }]
      },  
      yellow: {
        count: 2,
        list: [{
          actions: [],
          name: 'Command Power',
          type: 'Reaction',
          description: 'When you take damage from [elemental/energy], you may deal that much damage to another target.'
        },
        {
          actions: ['Attack', 'Hinder'],
          name: 'Dangerous Explosion',
          type: 'Action',
          description: 'Attack multiple targets using [power]. Use your Mid die. Hinder all targets damaged by this ability with your Min die. Hinder yourself with your Max die.'
        },
        {
          actions: ['Attack', 'Boost'],
          name: 'Embolden',
          type: 'Action',
          description: 'Attack using [power], and Boost all nearby heroes taking [choose two basic actions] using your Min die until your next turn.'
        },
        {
          actions: ['Boost', 'Recover'],
          name: 'Resolve',
          type: 'Action',
          description: 'Boost yourself using [power], then remove a penalty on yourself or Recover using your Min die.'
        }        ]
      }
    },
    description: 'You have been chosen by a higher force to carry out their work and have been given powers to make it happen; or you are a being from another realm, incarnated into a physical body, and your powers are a reflection of your true form.',
    archetype: [10, 8, 8]
  },   
  {
    id: 'theMultiverse',
    label: 'The Multiverse',
    powers: {
      categories: ['Psychic', 'Self Control'],
      list: ['Awareness', 'Cosmic', 'Intuition', 'Speed', 'Teleportation']
    },
    abilities: {
      yellow: {
        count: 2,
        list: [{
          actions: ['Boost', 'Attack'],
          name: 'Power From Beyhond',
          type: 'Attack',
          description: 'Boost yourself using [power]. Use your Max die. That bonus is persistent and exclusive. Then, Attack using your Min die.'
        },
        {
          actions: [],
          name: 'Respond In Kind',
          type: 'Reaction',
          description: 'When you are hit with an Attack at close range, the attacker also takes damage equal to their effect die.'
        },
        {
          actions: ['Hinder'],
          name: 'Dread Pallor',
          type: 'Action',
          description: 'Hinder multiple targets using [power]. Use your Mid die for one and your Min die for the rest.'
        },
        {
          actions: ['Attack'],
          name: 'Reality Scorned',
          type: 'Action',
          description: 'Attack using [power]. If your target survived, Hinder them using your Max die.'
        }]
      }
    },
    description: 'Your origin comes from traveling or being flung through the infinitely branching realms of time and space. Without the Multiverse itself, you would not have the powers you do now.',
    archetype: [10, 8, 6],
    extras: 'Gain a power from any category at d6'
  } 
]