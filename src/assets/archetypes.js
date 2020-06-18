export default [
  {
    label: 'Speedster',
    prerequisite: 'Speed',
    powers: {
      categories: ['Mobility'],
      list: ['Agility', 'Intangibility', 'Lightning Calculator', 'Vitality'],
    },
    qualities: {
      categories: ['Mental', 'Physical'],
      list: [],
    },
    abilities: {
      green: {
        count: 2,
        requirement: 'Speedster',
        list: [{
          actions: ['Attack', 'Defend'],
          name: 'Always on the Move',
          type: 'Action',
          description: 'Attack using [power/quality]. Defend yourself using your Min die.'
        },
        {
          actions: ['Boost', 'Hinder', 'Attack'],
          name: 'Fast Fingers',
          type: 'Action',
          description: 'Boost or Hinder using [power]. Use your Max die. If you roll doubles, you may also Attack using your Mid die.'
        },
        {
          actions: ['Attack', 'Hinder'],
          name: 'Non-Stop Assault',
          type: 'Action',
          description: 'Attack multiple targets using [quality]. Use your Min die. Hinder each target equal to your Mid die.'
        }]
      },
      yellow: {
        count: 1,
        list: [{
          actions: ['Attack', 'Hinder'],
          name: 'Blinding Strike',
          type: 'Action',
          description: 'Attack multiple targets using [quality]. Hinder each target equal to your Min die.'
        },
        {
          actions: ['Attack'],
          name: 'Flurry of Fists',
          type: 'Action',
          description: 'Attack using [quality]. Use your Max die. If you roll doubles, use Max+Min instead.'
        },
        {
          actions: ['Attack'],
          name: 'Supersonic Streak',
          type: 'Action',
          description: 'Attack multiple targets using [power]. Use your Max die against one target, and your Mid die against each other target. If you roll doubles, take irreducible damage equal to your Mid die.'
        },
        {
          actions: ['Boost'],
          name: 'Speedy Analysis',
          type: 'Action',
          description: 'Boost multiple targets using [power]. Use your Max die.'
        }]
      }
    },
    description: 'Sorrygottagobeintwelveplacesatonce...',
    personality: [10, 10],
    principle: 'Expertise'
  },
  {
    label: 'Shadow',
    prerequisite: 'Stealth',
    powers: {
      categories: ['Athletic'],
      list: ['Intangibility', 'Invisibility', 'Signature Weaponry']
    },
    qualities: {
      categories: ['Mental', 'Physical'],
      list: [],
    },    
    abilities: {
      green: { //shadow
        count: 2,
        requirement: 'Shadow',
        list: [{
          actions: ['Attack', 'Hinder'],
          name: 'Sabotage',
          type: 'Action',
          description: 'Attack using [power/quality]. Remove one physical bonus or penalty, Hinder a target using your Min die, or maneuver to a new location in your environment.'
        },
        {
          actions: ['Attack', 'Defend'],
          name: 'Shadowy Figure',
          type: 'Action',
          description: 'Attack using [power/quality]. Defend using your Min die against all Attacks until your next turn.'
        },
        {
          actions: ['Attack'],
          name: 'Untouchable',
          type: 'Reaction',
          description: 'When you would be dealt damage, roll a d4 while in the Green zone, d6 while in the Yellow, or d8 while in Red. Reduce the damage you take by the value rolled. Attack another target with that roll.'
        }]
      } ,     
      yellow: {
        count: 1,
        list: [{
          actions: ['Overcome', 'Attack', 'Boost'],
          name: 'Overcome From the Darkness',
          type: 'Action',
          description: 'Attack or Overcome using [power/quality]. Boost yourself using your Min die.'
        },
        {
          actions: ['Defend'],
          name: 'Diversion',
          type: 'Reaction',
          description: 'When you would take damage, Defend against that damage by rolling your single [power/quality] die.'
        }]
      }
    },
    description: 'You operate in the shadows via subtlety and guile.',
    principle: 'Expertise'
  },
  {
    label: 'Physical Powerhouse',
    prerequisite: 'Strength',
    powers: {
      categories: ['Athletic'],
      list: ['Density Control', 'Leaping', 'Signature Weaponry', 'Size-Changing']
    },
    qualities: {
      categories: ['Physical', 'Social'],
      list: []
    },    
    abilities: {
      green: { //physical powerhouse
        count: 2,
        list: [{
          actions: [],
          name: 'Damage Resistant',
          type: 'Inherent',
          description: 'Reduce any physical or energy damage you take by 1 while you are in the Green zone, 2 while in the Yellow zone, and 3 while in the Red zone.'
        },
        {
          actions: ['Attack'],
          name: 'Frontline Fighting',
          type: 'Action',
          description: 'Attack using [power/quality]. The target of that Attack must take an Attack action against you as its next turn, if possible.'
        },
        {
          actions: ['Boost'],
          name: 'Galvanize',
          type: 'Action',
          description: 'Boost using [power/quality]. Apply that bonus to all hero Attack and Overcome actions until the start of your next turn.'
        },
        {
          actions: ['Attack'],
          name: 'Power Strike',
          type: 'Action',
          description: 'Attack using [power/quality] and use your Max die.'
        },
        {
          actions: ['Recover'],
          name: 'Strength in Victory',
          type: 'Reaction',
          description: 'When you eliminate a minion with an Attack using [power/ quality], Recover Health equal to your Min die.'
        }]
      }
    },
    description: 'You are the brute squad.',
    principle: 'Expertise',
    extras: 'Gain a green ability as a yellow using a different power or quality.'
  },
  {
    label: 'Marksman',
    prerequisite: 'Signature Weaponry',
    powers: {
      categories: ['Athletic', 'Intellectual', 'Technological'],
      list: ['Signature Weaponry', 'Swinging']
    },
    qualities: {
      categories: ['Information', 'Mental', 'Physical'],
      list: []
    },
    abilities: {
      green: {
        count: 2,
        required: ['Signature Weaponry', 'quality'],
        list: [{
          actions: ['Attack'],
          name: 'Dual Wielder',
          type: 'Action',
          description: 'Attack two different targets using [power/quality], one target using your Mid die and the other your Min die.'
        },
        {
          actions: ['Boost'],
          name: 'Load',
          type: 'Action',
          description: 'Boost using [power/quality] to create one bonus using your Max die and another using your Mid die.'
        },
        {
          actions: ['Attack'],
          name: 'Precise Shot',
          type: 'Action',
          description: 'Attack using [power/quality]. Ignore all penalties on this Attack, ignore any Defend actions, and it cannot be affected by Reactions.'
        },
        {
          actions: ['Attack', 'Defend'],
          name: 'Spin and Shoot',
          type: 'Action',
          description: 'Attack using [power/quality]. Defend using your Min die.'
        },
        {
          actions: ['Boost'],
          name: 'Sniper Aim',
          type: 'Reaction',
          description: 'Boost yourself using [power/quality]. Use your Max+Min dice. This bonus can only be used against one chosen target, and is persistent & exclusive against that target until it leaves the scene.'
        }]
      },
      yellow: {
        count: 2,
        required: ['quality'],
        list: [{
          actions: ['Attack', 'Boost'],
          name: 'Called Shot',
          type: 'Action',
          description: 'Attack using [quality]. Create a Boost for another hero using your Max die.'
        },
        {
          actions: ['Attack', 'Overcome'],
          name: 'Exploding Ammo',
          type: 'Action',
          description: 'Attack or Overcome using [quality] on an environmental target, using your Max+Min dice. If you roll doubles, take a minor twist.'
        },
        {
          actions: ['Attack'],
          name: 'Hair Trigger Reflexes',
          type: 'Reaction',
          description: 'When a new target enters close range, Attack that target by rolling your single [quality] die.'
        },
        {
          actions: ['Attack'],
          name: 'Ricochet',
          type: 'Action',
          description: 'Attack using [quality]. Use your Max die. If you roll doubles, use Max+Min instead.'
        }]
      }      
    },
    description: 'Whether it’s guns, a bow and arrow, or something else, you know your aim is true.',
    principle: 'Responsibility'
  },
  {
    label: 'Blaster',
    prerequisite: 'Elemental/Energy',
    powers: {
      categories: ['Elemental/Energy', 'Mobility', 'Technological'],
      list: ['Signature Weaponry']
    },
    qualities: {
      categories: ['Mental', 'Physical'],
      list: []
    },
    abilities: {
      green: {
        count: 2,
        required: ['Blaster'],
        list: [{
          actions: ['Attack'],
          name: 'Exploit Vulnerability',
          type: 'Action',
          description: 'Attack using [power]. If you Attacked or Hindered that target in your previous turn, use your Max die in this Attack.'
        },
        {
          actions: ['Attack', 'Hinder'],
          name: 'Disabling Blast',
          type: 'Action',
          description: 'Attack using [power]. Hinder using your Min die.'
        },
        {
          actions: ['Attack'],
          name: 'Danger Zone',
          type: 'Action',
          description: 'Attack multiple targets using [power]. Use your Min die against each.'
        },
        {
          actions: ['Attack'],
          name: 'Precise Hit',
          type: 'Action',
          description: 'Attack using [power]. Ignore all penalties on this Attack, ignore any Defend actions, and it cannot be affected by Reactions'
        }]
      },
      yellow: {
        count: 2,
        required: ['power'],
        list: [{
          actions: ['Recover'],
          name: 'Energy Immunity',
          type: 'Inherent',
          description: 'If you would take damage from [element/energy you have a related power for], instead reduce that damage to 0 and Recover that amount of Health instead.'
        },
        {
          actions: ['Attack'],
          name: 'Heedless Blast',
          type: 'Action',
          description: 'Attack multiple targets using [power]. Use your Mid die against each target. Take irreducible damage equal to your Mid die.'
        },
        {
          actions: ['Attack'],
          name: 'Imbue with Element',
          type: 'Action',
          description: 'Attack using [power]. Use your Max die. If you choose another hero to go next, Boost that hero using your Mid die.'
        }]
      }      
    },
    description: 'No need to mess around, the best way to useenergy is to throw it at the bad guy.',
    principle: 'Esoteric'
  },
  {
    label: 'Close Quarters Combatant',
    prerequisite: 'Close Combat',
    powers: {
      categories: ['Athletic', 'Mobility', 'Technological'],
      list: ['Signature Weaponry']
    },
    qualities: {
      categories: ['Physical', 'Social'],
      list: []
    },
    abilities: {
      green: {
        count: 3,
        required: ['Close Combat'],
        list: [{
          actions: ['Defend', 'Attack'],
          name: 'Defensive Strike',
          type: 'Action',
          description: 'Defend using [power/quality]. Attack using your Min die.'
        },
        {
          actions: ['Attack'],
          name: 'Dual Strike',
          type: 'Action',
          description: 'Attack one target using [power/quality]. Attack a second target using your Min die.'
        },
        {
          actions: ['Attack', 'Defend', 'Boost', 'Hinder', 'Defend'],
          name: 'Flexible Stance',
          type: 'Action',
          description: 'Take any two basic actions using [power/quality], each using your Min die.'
        },
        {
          actions: ['Attack'],
          name: 'Offensive Strike',
          type: 'Action',
          description: 'Attack using [power/quality]. Use your Max die.'
        },
        {
          actions: ['Attack'],
          name: 'Precise Strike',
          type: 'Action',
          description: 'Attack using [power/quality]. Ignore all penalties on this Attack, ignore any Defend actions, and it cannot be affected by Reactions.'
        },
        {
          actions: ['Attack'],
          name: 'Throw Minion',
          type: 'Action',
          description: 'Attack a minion using [power]. Whatever that minion rolls as defense Attacks another target of your choice.'
        }]
      }    
    },
    description: 'You prefer to fight up close and personal.',
    principle: 'Responsibility',
    extras: 'Gain any ability as a yellow ability with a different power or quality'
  },  
  {
    label: 'Armored',
    powers: {
      categories: ['Athletic', 'Intellectual', 'Materials', 'Mobility', 'Technological'],
      list: ['Signature Weaponry', 'Signature Vehicle']
    },
    qualities: {
      categories: ['Physical', 'Social'],
      list: []
    },
    abilities: {
      green: {
        count: 4,
        list: [{
          actions: [],
          name: 'Armored',
          type: 'Inherent',
          description: 'Reduce any physical or energy damage you take by 1 while you are in the Green zone, 2 while in the Yellow zone, and 3 while in the Red zone.',
          required: true
        },
        {
          actions: [],
          name: 'Deflect',
          type: 'Reaction',
          description: 'When you would be dealt damage, you may deal damage to a nearby target equal to the amount reduced by your Armored ability.'
        },
        {
          actions: ['Attack'],
          name: 'Dual Offense',
          type: 'Action',
          description: 'Attack using [power]. Attack a second target with your Min die.'
        },
        {
          actions: ['Attack', 'Defend'],
          name: 'Living Bulwark',
          type: 'Action',
          description: 'Attack using [power]. Defend another target with your Min die.'
        },
        {
          actions: ['Attack', 'Recover'],
          name: 'Repair',
          type: 'Action',
          description: 'Attack using [power]. Recover Health equal to your Min die.'
        },
        {
          actions: ['Attack'],
          name: 'Unstoppable Charge',
          type: 'Action',
          description: 'Attack using [power/quality]. Ignore all penalties on this Attack, ignore any Defend actions, and it cannot be affected by Reactions.'
        }]
      }    
    },
    description: 'You are an indomitable and unstoppable force.',
    principle: 'Expertise',
    extras: 'When determining Health, you may use Materials or Technological power instead of Athletic power or Mental quality'
  },
  {
    label: 'Flyer',
    prerequisite: ['Signature Vehicle', 'Flight'],
    powers: {
      categories: ['Athletic', 'Mobility', 'Technological'],
      list: ['Signature Weaponry', 'Signature Vehicle']
    },
    qualities: {
      categories: ['Information', 'Physical'],
      list: []
    },
    abilities: {
      green: {
        count: 2,
        required: ['Flight', 'Signature Vehicle'],
        list: [{
          actions: ['Attack'],
          name: 'Aerial Bombardment',
          type: 'Action',
          description: 'Attack up to three targets using [power/quality]. Apply your Min die to each of them.'
        },
        {
          actions: ['Boost'],
          name: 'Aerial Surveilance',
          type: 'Action',
          description: 'Boost using [power/quality]. Apply that bonus to all hero Attack and Overcome actions until your next turn.'
        },
        {
          actions: ['Defend'],
          name: 'Barrel Roll',
          type: 'Reaction',
          description: 'When you are Attacked while Flying, you may Defend yourself by rolling your single [power/quality] die.'
        },
        {
          actions: ['Attack'],
          name: 'Dive and Drop',
          type: 'Action',
          description: 'Attack a minion using [power]. Use whatever that minion rolls for its save as an Attack against another target of your choice.'
        },
        {
          actions: ['Hinder'],
          name: 'Sonic Boom',
          type: 'Action',
          description: 'Hinder multiple targets using [power]. Apply your Min die to each of them.'
        },
        {
          actions: ['Attack', 'Defend'],
          name: 'Strike and Swoop',
          type: 'Action',
          description: 'Attack using [power/quality]. Defend against all Attacks against you using your Min die until your next turn.'
        }]
      }    
    },
    description: 'The best way to support your team is from the air.',
    principle: 'Ideals',
    extras: 'Gain one ability as a yellow ability'
  },
  {
    label: 'Elemental Manipulator',
    prerequisite: ['Elemental/Energy'],
    powers: {
      categories: ['Elemental/Energy'],
      list: ['Absorption', 'Flight', 'Leaping', 'Swimming', 'Signature Weaponry', 'Signature Vehicle', 'Transmutation']
    },
    qualities: {
      categories: ['Mental', 'Physical'],
      list: ['Magical Lore', 'Science']
    },
    abilities: {
      green: {
        count: 2,
        required: ['Elemental/Energy'],
        unique: false, //todo: apply to all others should be true in most cases
        list: [{
          actions: ['Attack'],
          name: 'Backlash',
          type: 'Action',
          description: 'Attack using [power]. Take damage equal to your Min die.'
        },
        {
          actions: ['Attack'],
          name: 'External Combustion',
          type: 'Action',
          description: 'Attack up to two targets using [power]. Also take an amount of damage equal to your Mid die.'
        },
        {
          actions: ['Defend', 'Boost'],
          name: 'Energy Conversion',
          type: 'Reaction',
          description: 'Defend using [power]. Use your Max die. Boost using your Min die.'
        },
        {
          actions: ['Hinder', 'Attack'],
          name: 'Focused Apparatus',
          type: 'Action',
          description: 'Hinder using [power]. Attack using your Min die. If you are in the Red zone, you may apply the penalty to any number of nearby targets.'
        }]
      },
      yellow: {
        count: 1,
        required: ['Elemental/Energy'],
        list: [{
          actions: ['Attack'],
          name: 'Damage Spike',
          type: 'Action',
          description: 'Attack using [power]. Use your Max+Min dice. Take damage equal to your Mid die.'
        },
        {
          actions: ['Recover'],
          name: 'Energy Alignment',
          type: 'Inherent',
          description: 'If you would take damage from [element/energy you have a related power for], reduce that damage to 0 and Recover that amount of Health instead.'
        },
        {
          actions: [],
          name: 'Energy Redirection',
          type: 'Inherent',
          description: 'Whenever you take damage from [element/energy you have a related power for], you may also inflict that much damage on another target.'
        },
        {
          actions: ['Attack'],
          name: 'Live Dangerously',
          type: 'Action',
          description: 'Attack multiple targets using [power]. Take damage equal to your Max die.'
        }]
      } 
    },
    description: 'Energies are yours to command and flow, sometimes through your own body.',
    principle: 'Esoteric'
  },  
  {
    label: 'Robot/Cyborg',
    powers: {
      categories: ['Athletic', 'Intellectual', 'Mobility', 'Self Control', 'Technological'],
      list: ['Signature Weaponry', 'Signature Vehicle']
    },
    qualities: {
      categories: ['Information', 'Mental'],
      list: []
    },
    abilities: {
      green: {
        count: 2,
        unique: true,
        list: [{
          actions: ['Boost', 'Defend'],
          name: 'Adaptive Programming',
          type: 'Action',
          description: 'Boost yourself using [power], and Defend with your Min die.'
        },
        {
          actions: [],
          name: 'Metal Skin',
          type: 'Inherent',
          description: 'Reduce the amount of physical damage taken by 1 while you are in the green zone, 2 while in the Yellow zone, and 3 while in the Red zone.'
        },
        {
          actions: ['Attack'],
          name: 'Living Arsenal',
          type: 'Action',
          description: 'Attack using [power] with a bonus equal to the number of bonuses you currently have.'
        },
        {
          actions: ['Boost'],
          name: 'Self-Improvement',
          type: 'Action',
          description: 'Boost yourself using [power]. That bonus is persistent and exclusive.'
        },
        {
          actions: ['Attack'],
          name: 'Something for Everyone',
          type: 'Action',
          description: 'Attack using [power]. Use your Mid die to Attack one extra target for each bonus you have. Apply a different bonus to each Attack.'
        }]
      },
    },
    description: 'Your machine nature gives you adaptability and firepower.',
    principle: 'Expertise',
    extras: ['Technological power at d10', 'Gain ability at yellow', 'Use Technological power instead of Athletic power or Mental quality when determining Health']
  },
  {
    label: 'Sorcerer',
    powers: {
      categories: ['Elemental/Energy', 'Materials', 'Mobility', 'Psychic', 'Self Control'],
      list: []
    },
    qualities: {
      categories: ['Information', 'Mental'],
      list: []
    },
    abilities: {
      green: {
        count: 2,
        unique: true,
        list: [{
          actions: ['Hinder', 'Attack'],
          name: 'Banish',
          type: 'Action',
          description: 'Hinder using [power] . Use your Max die. If you roll doubles, also Attack using your Mid die.'
        },
        {
          actions: ['Attack'],
          name: 'Energy Jaunt',
          type: 'Action',
          description: 'Attack multiple targets using [power], applying your Min die against each.'
        },
        {
          actions: ['Attack'],
          name: 'Powerful Blast',
          type: 'Action',
          description: 'Attack using [power] and use your Max die.'
        },
        {
          actions: ['Attack', 'Hinder'],
          name: 'Subdue',
          type: 'Action',
          description: 'Attack using [power]. Hinder the same target using your Min die.'
        }]
      },
      yellow: {
        count: 1,
        unique: true,
        list: [{
          actions: ['Hinder'],
          name: 'Cords of Magic',
          type: 'Action',
          description: 'Destroy all bonuses and penalties on a target. Then, Hinder that target using [power], using your Max die.'
        },
        {
          actions: ['Attack'],
          name: 'Field of Energy',
          type: 'Action',
          description: 'Attack multiple targets near each other using [power].'
        },
        {
          actions: ['Attack'],
          name: 'Living Bomb',
          type: 'Action',
          description: 'Destroy one d6 or d8 minion. Roll that minion’s die as an Attack against another target.'
        }]
      },      
    },
    description: 'You command an arsenal of spells and mystical forces.',
    principle: 'Esoteric'
  },  
  {
    label: 'Psychic',
    prerequisite: 'Psyhic',
    powers: {
      categories: ['Psychic', 'Intellectual', 'Materials', 'Self Control'],
      list: []
    },
    qualities: {
      categories: ['Mental'],
      list: []
    },
    abilities: {
      green: {
        count: 2,
        list: [{
          actions: ['Attack', 'Hinder'],
          name: 'Psychic Assault',
          type: 'Action',
          description: 'Attack using [Psychic power]. Hinder the target using your Min die.'
        },
        {
          actions: ['Boost'],
          name: 'Psychic Coordination',
          type: 'Action',
          description: 'Boost using [Psychic power]. Apply that bonus to all hero Attack and Overcome actions until your next turn.'
        },
        {
          actions: [],
          name: 'Psychic Insight',
          type: 'Reaction',
          description: 'After rolling during your turn, you may take 1 damage to reroll your entire dice pool.'
        }]
      },
      yellow: {
        count: 2,
        list: [{
          actions: ['Overcome'],
          name: 'Astral Projection',
          type: 'Action',
          description: 'Overcome using Remote Viewing and use your Max+Min dice. You do not have to be physically present in the area you are Overcoming.',
          requires: 'Remote Viewing'
        },
        {
          actions: ['Defend'],
          name: 'Illusionary Double',
          type: 'Reaction',
          description: 'When you are Attacked, Defend by rolling your single Illusions die.',
          requires: 'Illusions'
        },
        {
          actions: ['Attack', 'Hinder'],
          name: 'Minion Suggestion',
          type: 'Action',
          description: 'Attack a minion using Suggestion. If that minion would be taken out, you control its next action, and then it is removed. Otherwise, Hinder it using your Min die.',
          requires: 'Suggestion'
        },
        {
          actions: ['Boost'],
          name: 'Precognitive Alteration',
          type: 'Reaction',
          description: 'After an ally rolls dice to take an action for their turn but before using the result, Boost that ally’s roll using your single Precognition die.',
          requires: 'Precognition'
        },
        {
          actions: ['Hinder'],
          name: 'Postcognitive Understanding',
          type: 'Reaction',
          description: 'After an enemy rolls dice to take an action for their turn but before using the result, Hinder that enemy’s roll using your single Postcognition die.',
          requires: 'Postcognition'
        },
        {
          actions: ['Boost'],
          name: 'Psychic Analysis',
          type: 'Action',
          description: 'Boost yourself using [Mental quality]. Either use your Max die, or use your Mid die and make it persistent.'
        },
        {
          actions: ['Attack'],
          name: 'Swarm',
          type: 'Action',
          description: 'Attack multiple targets using Animal Control and use your Min die.',
          requires: 'Animal Control'
        },
        {
          actions: ['Attack'],
          name: 'Telekinetic Assault',
          type: 'Action',
          description: 'Attack using Telekinesis. Either Attack one target and use your Max die, or two targets and use your Mid die against one and your Min die against another.',
          requires: 'Telekinesis'
        },
        {
          actions: ['Attack', 'Hinder'],
          name: 'Telepathic Whammy',
          type: 'Action',
          description: 'Attack using Telepathy and use your Max die. Hinder the target with a persistent penalty equal to your Min die.',
          requires: 'Telepathy'
        },]
      },      
    },
    description: 'Mysterious mental abilities give you the ability to manifest a variety of powers with but a thought.',
    principle: 'Esoteric'
  },
  {
    label: 'Transporter',
    prerequisite: ['Signature Vehicle', 'Mobility'],
    powers: {
      categories: ['Athletic', 'Mobility', 'Psychic', 'Technological'],
      list: ['Signature Vehicle']
    },
    qualities: {
      categories: ['Physical', 'Social'],
      list: []
    },
    abilities: {
      green: {
        count: 2,
        list: [{
          actions: ['Attack', 'Hinder'],
          name: 'Displacement Assault',
          type: 'Action',
          description: 'Attack using [power]. Either Hinder your target with your Min die or move them somewhere else in the scene.'
        },
        {
          actions: ['Attack', 'Defend'],
          name: 'Hit and Run',
          type: 'Action',
          description: 'Attack using [power]. Defend against all Attacks against you using your Min die until your next turn.'
        },
        {
          actions: [],
          name: 'Mobile Dodge',
          type: 'Reaction',
          description: 'When you are hit with an Attack, you may take 1 irreducible damage to have the attacker reroll their dice pool.'
        },
        {
          actions: ['Boost', 'Attack'],
          name: 'Mobile Assist',
          type: 'Action',
          description: 'Boost another hero using [power]. Attack using your Min die.'
        },
        {
          actions: ['Attack'],
          name: 'Run Down',
          type: 'Action',
          description: 'Attack multiple targets using [power]. Use your Min die against each.'
        }]
      }      
    },
    description: 'You know how to get exactly where you need to be, when you need to be there.',
    principle: 'Expertise',
    extras: 'Gain one yellow'
  },
  {
    label: 'Minion Maker',
    powers: {
      categories: ['Elemental/Energy', 'Materials'],
      list: ['Duplication', 'Inventions', 'Part Detachment', 'Robotics']
    },
    qualities: {
      categories: ['Information', 'Mental'],
      list: []
    },
    abilities: {
      green: {
        count: 2,
        list: [{
          actions: [],
          name: 'Make Minion',
          type: 'Action',
          description: 'Create a minion using [power]. Reference the minion chart to see what size of minion it is. Choose whether it can Attack, Defend, Boost, Hinder, or Overcome. It acts on the start of your turn. You can only use this ability in a situation conducive to how you create minions.',
          unique: true
        },
        {
          actions: ['Boost'],
          name: 'Power Up',
          type: 'Action',
          description: 'Boost another hero or one of your minions using [power]. Either use your Max die, or use your Mid die and make that bonus persistent.'
        }]
      },
      yellow: {
        count: 1,
        list: [{
          actions: [],
          name: 'Minion Formation',
          type: 'Reaction',
          description: 'Reduce any damage you take by the number of minions you have. Whenver damage is reduced this way, reduce the size of one of your minions.'
        },
        {
          actions: [],
          name: 'Rapid Deployment',
          type: 'Action',
          description: 'Create a minion using [power] using your Min die, and reference the minion chart to see what size of minion it is. It acts now and at the start of your turns.'
        },
        {
          actions: ['Boost'],
          name: 'Upgrade Minion',
          type: 'Action',
          description: 'Boost one of your minions using [power]. You may also upgrade that minion to your Max die size, replacing its minion form.'
        }]
      },
      red: { //these are available when choosing red abilities
        count: 0,
        list: [{
          actions: [],
          name: 'Construction Focus',
          type: 'Action',
          description: 'Create two minions using [power], one with your Max die and one with your Mid die. Choose which one basic action each of them can perform. They act on the start of your turn.'
        },
        {
          actions: ['Attack'],
          name: 'Swarm Combat',
          type: 'Action',
          description: 'Attack using [power]. Use your Max die plus a bonus equal to the number of minions you have.'
        },
        {
          actions: [],
          name: 'Sacrifice',
          type: 'Reaction',
          description: 'When you are Attacked, redirect the Attack to one of your nearby minions.'
        }]        
      }
    },
    description: 'Who needs friends when you can just make them?',
    principle: 'Expertise',
    auxilary: {
      minions: [{ //see page 142-143
        maximum: 0,
        die: 4,
        form: 'Tiny/Featureless'
      },
      {
        minimum: 1,
        maximum: 3,
        die: 6,
        form: 'Small/Limited Detail'
      },
      {
        minimum: 4,
        maximum: 7,
        die: 8,
        form: 'House Pet Sized/Detailed'
      },
      {
        minimum: 8,
        maximum: 11,
        die: 10,
        form: 'Humanoid Sized/Intricate'
      },
      {
        maximum: 12,
        die: 12,
        form: 'Large/Paragon'
      }],
      forms: [{
        name: 'Autonomous',
        description: 'The minion can take any of the basic actions, not just one.',
        bonus: 1
      },
      {
        name: 'Burrowing',
        description: 'The minion can tunnel through the earth.',
        bonus: 1
      },
      {
        name: 'Floating',
        description: 'The minion can fly and maneuver in the air.',
        bonus: 1
      },
      {
        name: 'Pack',
        description: 'The minion adds +1 to its Attack for each other pack minion attacking the same target this round.',
        bonus: 2
      },
      {
        name: 'Explosive',
        description: 'When the minion is destroyed, also remove a bonus or penalty of your choice.',
        bonus: 2
      },
      {
        name: 'Reinforced',
        description: 'The minion adds +1 to its roll to save.',
        bonus: 2
      },
      {
        name: 'Harsh',
        description: 'When Hindering, the target also takes damage equal to that penalty.',
        bonus: 3
      },
      {
        name: 'Stealth',
        description: 'On a successful minion save, do not reduce this minion’s die size.',
        bonus: 3
      },
      {
        name: 'Swift',
        description: 'The minion rolls twice for its action and chooses the higher die.+',
        bonus: 3
      },
      {
        name: 'Champion',
        description: 'When Boosting, may apply the bonus to all actions by its creator and their minions until your next turn.',
        bonus: 4
      },
      {
        name: 'Hive-Mind',
        description: 'While this minion is active, all your other minions can take the same action as it does.',
        bonus: 4
      },
      {
        name: 'Turret',
        description: 'When Attacking, the minion may split its die into two dice of smaller sizes.',
        bonus: 4
      }]
    }
  },  
  {
    label: 'Wild Card',
    powers: {
      categories: ['Athletic', 'Intellectual', 'Mobility', 'Self Control'],
      list: ['Signature Weaponry', 'Signature Vehicle']
    },
    qualities: {
      categories: ['Physical', 'Social'],
      list: []
    },
    abilities: {
      green: {
        count: 2,
        unique: true,
        list: [{
          actions: ['Attack', 'Boost', 'Hinder'],
          name: 'Gimmick',
          type: 'Action',
          description: 'Boost or Hinder using [power]. Use your Max die. If you roll doubles, you may also Attack using your Mid die.'
        },
        {
          actions: ['Attack', 'Defend', 'Boost', 'Hinder', 'Overcome'],
          name: 'Multi-Task',
          type: 'Action',
          description: 'Take any two different basic actions using [power/quality], each using your Min die.'
        },
        {
          actions: [],
          name: 'Surprise Results',
          type: 'Reaction',
          description: 'After rolling your dice pool for the turn, you may lose 1 Health to reroll your entire pool.'
        },
        {
          actions: ['Attack', 'Defend', 'Boost', 'Hinder', 'Overcome'],
          name: 'Unknown Results',
          type: 'Action',
          description: 'Take any basic action using [power]. Then roll a d6. On 1, Boost with your Min die. On 2, Hinder with your Min die. On 3, Defend with your Min die. On 4, lose Health equal to your Min die. On 5, your basic action uses your Max die. On 6, your basic action uses your Min die.'
        }]
      },
      yellow: {
        count: 1,
        list: [{
          actions: [],
          name: 'Break the 4th',
          type: 'Reaction',
          description: 'You may uncheck a checked off collection on your hero sheet.'
        },
        {
          actions: ['Attack'],
          name: 'Danger!',
          type: 'Action',
          description: 'Attack multiple targets using [power]. If you roll doubles, one nearby ally is also hit with the Attack.'
        },
        {
          actions: [],
          name: 'Expect the Unexpected',
          type: 'Reaction',
          description: 'Apply a bonus after rolling your action, instead of before.'
        },
        {
          actions: [],
          name: 'Imitation',
          type: 'Action',
          description: 'Use a Green action ability of a nearby ally (using the same size power/quality die they would use.)'
        },
        {
          actions: [],
          name: 'Turn the Tables',
          type: 'Action',
          description: 'Change any bonus into a penalty of equal size or vice versa.'
        }        ]
      }            
    },
    description: 'No one knows what you will do next — not the bad guys, not your allies, sometimes not even you.',
    principle: 'Ideals'
  },
  {
    label: 'Form Changer',
    prerequisite: 'Self Control',
    powers: {
      categories: ['Athletic', 'Mobility', 'Self Control', 'Technological'],
      list: []
    },
    qualities: {
      categories: ['Physical', 'Information'],
      list: []
    },
    abilities: {
      green: {
        count: 2,
        list: [{
          actions: ['Attack', 'Defend', 'Boost', 'Hinder', 'Overcome'],
          name: 'Change Forms',
          type: 'Action',
          description: 'Take a basic action using [Self Control power], then switch to any available form.',
          required: true
        },
        {
          actions: ['Attack', 'Recover'],
          name: 'Form Recovery',
          type: 'Action',
          description: 'Attack using [Self Control power] and Recover Health equal to your Min die. Return to your base form.'
        },
        {
          actions: ['Attack'],
          name: 'Surprise Shift',
          type: 'Action',
          description: 'Attack using [Self Control power] and use your Max die. Then change to any available form.'
        },
        {
          actions: ['Attack', 'Defend', 'Boost', 'Hinder', 'Overcome'],
          name: 'Unknown Results',
          type: 'Action',
          description: 'Take any basic action using [power]. Then roll a d6. On 1, Boost with your Min die. On 2, Hinder with your Min die. On 3, Defend with your Min die. On 4, lose Health equal to your Min die. On 5, your basic action uses your Max die. On 6, your basic action uses your Min die.'
        }]
      },
      yellow: {
        count: 1,
        list: [{
          actions: [],
          name: 'Break the 4th',
          type: 'Reaction',
          description: 'You may uncheck a checked off collection on your hero sheet.'
        },
        {
          actions: ['Attack'],
          name: 'Danger!',
          type: 'Action',
          description: 'Attack multiple targets using [power]. If you roll doubles, one nearby ally is also hit with the Attack.'
        },
        {
          actions: [],
          name: 'Expect the Unexpected',
          type: 'Reaction',
          description: 'Apply a bonus after rolling your action, instead of before.'
        },
        {
          actions: [],
          name: 'Imitation',
          type: 'Action',
          description: 'Use a Green action ability of a nearby ally (using the same size power/quality die they would use.)'
        },
        {
          actions: [],
          name: 'Turn the Tables',
          type: 'Action',
          description: 'Change any bonus into a penalty of equal size or vice versa.'
        }        ]
      }            
    },
    description: 'You can shift yourself betweena few different forms.',
    principle: 'Esoteric',
    auxilary: {
      green: {
        count: 2,
        extras: 'Swap dice between your powers for each form, including adding more, or removing some. Each gains an ability only usable in that form',       
        list: [{
          actions: ['Boost', 'Overcome'],
          name: 'Clever Form',
          type: 'Action',
          description: 'Boost or Overcome using [power]. Use your Max die.'
        },
        {
          actions: ['Defend'],
          name: 'Miniscule Form',
          type: 'Action',
          description: 'Defend using [power]. Use your Max die. Remove all penalties on you.'
        },
        {
          actions: ['Attack'],
          name: 'Strong Form',
          type: 'Action',
          description: 'Attack using [power]. Use your Max die.'
        },
        {
          actions: [],
          name: 'Tough Form',
          type: 'Inherent',
          description: 'Reduce any physical or energy damage you take by 1 while you are in the Green zone, 2 while in the Yellow zone, and 3 while in the Red zone.'
        },
        {
          actions: ['Boost', 'Hinder'],
          name: 'Tricky Form',
          type: 'Action',
          description: 'Boost or Hinder using [power]. Use your Max die.'
        },
        {
          actions: ['Attack', 'Hinder'],
          name: 'Weird Form',
          type: 'Reaction',
          description: 'When an opponent would Attack you in close combat while in this form, you may Attack or Hinder them first by rolling your single [power] die.'
        }]
      },
      yellow: {
        count: 1,
        extras: 'Swap powers around and upgrade any 2 dice by one size. Pick from any yellow or green forms.',
        list: [{
          actions: ['Attack', 'Defend'],
          name: 'Agile Form',
          type: 'Action',
          description: 'Attack using [power]. Defend against all attacks until your next turn with your Min die.'
        },
        {
          actions: ['Boost', 'Recover'],
          name: 'Regenerating Form',
          type: 'Action',
          description: 'Boost using [power]. Recover Health equal to your Min die.'
        },
        {
          actions: ['Hinder'],
          name: 'Speedy Form',
          type: 'Action',
          description: 'Hinder multiple targets using [power]'
        },
        {
          actions: ['Attack'],
          name: 'Towering Form',
          type: 'Action',
          description: 'Attack multiple targets using [power]'
        }]
      },
      red: {
        count: 1,
        list: [{
          actions: [],
          name: 'Emergency Change',
          type: 'Reaction',
          description: 'When hit with an Attack, change to any form before resolving the Attack. Take a minor twist.'
        }]
      }
    }
  },
  {
    label: 'Gadgeteer',
    prerequisite: 'Intellectual',
    powers: {
      categories: ['Intellectual', 'Mobility', 'Psychic', 'Technological'],
      list: ['Signature Weaponry', 'Signature Vehicle']
    },
    qualities: {
      categories: ['Information', 'Mental'],
      list: []
    },
    abilities: {
      green: {
        count: 2,
        unique: true,
        list: [{
          actions: [],
          name: 'Analyze Probabilities',
          type: 'Reaction',
          description: 'After rolling your dice pool, you may lose 1 Health to reroll your dice pool.'
        },
        {
          actions: ['Hinder'],
          name: 'Analyze Weakness',
          type: 'Action',
          description: 'Hinder using [power]. Use your Max die, or use your Mid die and make it persistent and exclusive.'
        },
        {
          actions: ['Boost'],
          name: 'Equip',
          type: 'Action',
          description: 'Boost using [power]. Make one bonus for one ally using your Mid die and another for another ally using your Min die.'
        },
        {
          actions: ['Boost'],
          name: 'Helpful Invention',
          type: 'Action',
          description: 'Boost using [power]. Use your Max die, or use your Mid die and make it persistent and exclusive.'
        }]
      },
      yellow: {
        count: 1,
        list: [{
          actions: [],
          name: 'Helpful Analysis',
          type: 'Reaction',
          description: 'One nearby ally may reroll their dice pool. You lose Health equal to the Min die of the new roll.'
        },
        {
          actions: ['Boost', 'Attack'],
          name: 'Snap Decision',
          type: 'Action',
          description: 'Boost yourself using [power]. Use your Max+Min dice. Then Attack using your Mid die with that bonus.'
        },
        {
          actions: [],
          name: 'Turn the Tables',
          type: 'Action',
          description: 'Change any bonus into a penalty of equal size or vice versa.'
        }]
      }            
    },
    description: 'Any problem can be solved through sufficient brainpower.',
    principle: 'Identity'
  },  
  {
    label: 'Reality Shaper',
    powers: {
      categories: ['Intellectual', 'Psychic', 'Technological'],
      list: ['Density Control', 'Intangibility', 'Invisibility', 'Speed', 'Teleportation', 'Transmutation']
    },
    qualities: {
      categories: ['Information', 'Mental'],
      list: []
    },
    abilities: {
      green: {
        count: 2,
        unique: true,
        list: [{
          actions: ['Hinder'],
          name: 'Negative Likelihood',
          type: 'Action',
          description: 'Hinder using [power]. That penalty is persistent and exlusive.'
        },
        {
          actions: [],
          name: 'Not Quite Right',
          type: 'Reaction',
          description: 'After a dice pool is rolled, adjust one die up or down one value on the die.'
        },
        {
          actions: ['Boost', 'Attack'],
          name: 'Probability Insight',
          type: 'Action',
          description: 'Boost using [power]. Use your Max die. If you roll doubles, you may also Attack using your Mid die.'
        },
        {
          actions: ['Attack'],
          name: 'Warp Space',
          type: 'Action',
          description: 'Attack using [power]. You may move the target of that Attack anywhere else nearby. If the target goes next, you decide who takes the next turn after that.'
        }]
      },
      yellow: {
        count: 1,
        list: [{
          actions: [],
          name: 'Alternate Outcome',
          type: 'Reaction',
          description: 'When a nearby enemy rolls their dice pool for the turn, you may lose 1 Health to reroll their entire pool.'
        },
        {
          actions: [],
          name: 'Helpful Analysis',
          type: 'Reaction',
          description: 'One nearby ally may reroll their dice pool. You lose Health equal to the Min die of the new roll.'
        },
        {
          actions: [],
          name: 'Never Happened',
          type: 'Reaction',
          description: 'When a nearby enemy would create a bonus or penalty, you may remove it immediately.'
        },
        {
          actions: [],
          name: 'Retroactive Rewrite',
          type: 'Reaction',
          description: 'You may apply a bonus to a roll after rolling instead of before.'
        }]
      }            
    },
    description: 'God may not play dice with the universe, but you do.',
    principle: 'Expertise'
  },
  {
    label: 'Divided', //todo
    description: 'You have two very different forms, such as an unpowered civilian form and a powered heroic form.',
    principle: 'Responsibility'
  },
  {
    label: 'Modular', //todo
    description: 'You have multiple forms (configurations, fighting styles, etc.) that each give their own advantages and disadvantages.',
    principle: 'Expertise'
  },  
]