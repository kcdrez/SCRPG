export default [
  {
    id: 'upperClass',
    label: 'Upper Class',
    qualities: {
      dice: [10, 8],
      categories: ['Mental'],
      list: ['Fitness', 'Persuasion']
    },
    description: 'You were born in the upper echelons of high society. Likely you’re also pretty darn rich.',
    powerSource: [10, 8, 8],
    principle: 'Responsibility'
  },
  {
    id: 'blankSlate',
    label: 'Blank Slate',
    qualities: {
      dice: [10, 8],
      categories: ['Mental', 'Physical'],
      list: []
    },
    description: 'You were born in the upper echelons of high society. Likely you’re also pretty darn rich.You remember nothing. Were you brainwashed? Maybe you were just created? One way or another, you have no history. You start now. Your future is what you make of it.',
    powerSource: [10, 8, 8],
    principle: 'Identity'
  },
  {
    id: 'struggling',
    label: 'Struggling',
    qualities: {
      dice: [8, 6, 6],
      categories: ['Physical'],
      list: ['Banter', 'Criminal Underworld Info']
    },
    description: 'You’ve been down and out. Perhaps you’ve recovered a bit, but you also might still be stuck in a terrible situation. Low on resources and luck, you did your best, but it often just wasn’t good enough.',
    powerSource: [8, 8, 6],
    principle: 'Responsibility'
  },
  {
    id: 'adventurer',
    label: 'Adventurer',
    qualities: {
      dice: [10, 8],
      categories: ['Physical'],
      list: ['History', 'Leadership']
    },
    description: 'In your past, you have sought excitement and adventure at every turn. Even before you were a hero, you were a thrill seeker.',
    powerSource: [8, 8, 8],
    principle: 'Expertise'
  },
  {
    id: 'unremarkable',
    label: 'Unremarkable',
    qualities: {
      dice: [10, 8],
      categories: ['Mental', 'Social'],
      list: ['Close Combat']
    },
    description: 'You were just a regular person, leading a normal life, until something came along and changed your life in a major way. You came from a commonplace background, but now you’re a hero.',
    powerSource: [10, 8, 6],
    principle: 'Identity'
  },
  {
    id: 'lawEnforcement',
    label: 'Law Enforcement',
    qualities: {
      dice: [10, 8],
      categories: ['Mental', 'Social'],
      list: ['Close Combat', 'Criminal Underworld Info', 'Ranged Combat']
    },    
    description: 'You’re a member of law enforcement, such as a beat cop, detective, or perhaps a lawyer or judge. you made a career of the law at one point. perhaps you still do.',
    powerSource: [10, 8, 6],
    principle: 'Responsibility'
  },
  {
    id: 'academic',
    label: 'Academic',
    qualities: {
      dice: [12, 8],
      categories: ['Information'],
      list: ['Leadership', 'Self-Discipline']
    },    
    description: 'You work or study in a field of knowledge. You could be a school teacher, professor, researcher, or clergy member. The pursuit of knowledge is very important to you, and possibly what led you to become a hero.',
    powerSource: [10, 8],
    principle: 'Expertise'
  },
  {
    id: 'tragic',
    label: 'Tragic',
    qualities: {
      dice: [10, 8],
      categories: ['Mental'],
      list: ['Banter', 'Close Combat', 'Imposing']
    },    
    description: 'Your history is eclipsed by a major negative event That shaped the rest of your life. You struggle to overcome the memory of the tragic event, be it the loss of a loved one or something that happened to you directly. Either way, the tragedy both fuels and haunts you.',
    powerSource: [10, 10, 6],
    principle: 'Ideals'
  },  
  {
    id: 'performer',
    label: 'Performer',
    qualities: {
      dice: [10, 8],
      categories: ['Social'],
      list: ['Acrobatics', 'Creativity', 'Finesse']
    },     
    description: 'You were born for the stage. How you present yourself to the world is important to you, whether in or out of the limelight.',
    powerSource: [10, 8, 6],
    principle: 'Responsibility'
  },  
  {
    id: 'military',
    label: 'Military',
    qualities: {
      dice: [10, 8],
      categories: ['Physical'],
      list: ['Leadership', 'Self-Discipline']
    },     
    description: 'You have some sort of combat training, possibly as Part of an organized armed forces. You might have even had combat experience before you became a hero.',
    powerSource: [10, 8, 8],
    principle: 'Ideals'
  },
  {
    id: 'retired',
    label: 'retired',
    qualities: {
      dice: [10, 10],
      categories: ['Information', 'Social'],
      list: []
    },     
    description: 'You used to wear the cape and cowl, but hung them up long ago. Now, something has changed, making you feel compelled to once again take up the fight for what is right. You never thought you would be here again.',
    powerSource: [12, 6, 6],
    principle: 'Identity'
  },
  {
    id: 'criminal',
    label: 'Criminal',
    qualities: {
      dice: [10, 8],
      categories: ['Physical'],
      list: ['Criminal Underworld Info', 'Imposing']
    },     
    description: 'You spent too much time on the wrong side of the law. But something changed for you. Now you’ve turned over a new leaf, using your powers and abilities to be the best hero you can.',
    powerSource: [8, 8, 8],
    principle: 'Expertise'
  },  
  {
    id: 'medical',
    label: 'Medical',
    qualities: {
      dice: [10, 8, 6],
      categories: ['Mental'],
      list: ['Finesse', 'Science', 'Technology']
    },    
    description: 'You were in the business of healing, as a doctor or nurse or maybe even a veterinarian. Given your medical background, you have a lot of experience with treating injuries and diseases.',
    powerSource: [10, 8, 8],
    principle: 'Expertise'
  },
  {
    id: 'anachronistic',
    label: 'Anachronistic',
    qualities: {
      dice: [10, 8],
      categories: ['Physical'],
      list: ['History', 'Magical Lore', 'Technology']
    },       
    description: 'One way or another, you aren’t quite in your time. You could be a stranded time traveler, or just a person who fits more with the ideals and customs of a time long before or after the one in which you currently reside. Either way, though this time is not your own, you still fight to protect it.',
    powerSource: [10, 8, 6],
    principle: 'Esoteric'
  },
  {
    id: 'exile',
    label: 'Exile',
    qualities: {
      dice: [10, 8],
      categories: ['Information'],
      list: ['Conviction', 'Insight']
    },
    description: 'You’re far from your home, one way or another. You may have left of your own accord, but it’s equally likely that you were sent away from whatever place you came from. Either way, you’re making your own way in the land where you now live.',
    powerSource: [8, 8, 8],
    principle: 'Ideals'
  },
  {
    id: 'formerVillain',
    label: 'Former Villain',
    qualities: {
      dice: [10, 8],
      categories: ['Information', 'Social'],
      list: ['Conviction']
    },    
    description: 'You used to be a foe to the heroes, but you’ve changed your stripes. You may have realized the evil of your former ways, or your motivation might have changed to ally you with those you once fought. Either way, you are now a hero, though many other heroes are hesitant to trust you.',
    powerSource: [10, 8, 8],
    principle: 'Expertise'
  },  
  {
    id: 'interstellar',
    label: 'Interstellar',
    qualities: {
      dice: [12, 8],
      categories: ['Information', 'Mental'],
      list: []
    },      
    description: 'You come from beyond the stars! As a newcomer to planet Earth, you may be unaware the strange customs here, but you can still communicate with earthlings, one way or another. You might be an alien, or a human from a civilization lost in space long ago, or something else entirely.',
    powerSource: [10, 8, 6],
    principle: 'Esoteric'
  },
  {
    id: 'dynasty',
    label: 'Dynasty',
    qualities: {
      dice: [10, 10],
      categories: ['Social'],
      list: ['Close Combat', 'Fitness', 'History']
    },     
    description: 'You come from a line of heroes. It could be that your parents and their parents and their parents have all been heroes. Maybe you’re Adopted into a hero family. Regardless of how you came to be a part of this dynasty, heroism is part of your life.',
    powerSource: [8, 8, 6],
    principle: 'Ideals'
  }, 
  {
    id: 'otherWorldly',
    label: 'Other Worldly',
    qualities: {
      dice: [10, 8],
      categories: ['Mental'],
      list: ['Magical Lore', 'Otherworldly Mythos']
    },
    description: 'You have at least a little of the uncanny in you. You could be a fully supernatural creature, or perhaps the spawn of one and a human.',
    powerSource: [10, 6, 6],
    principle: 'Esoteric'
  }, 
  {
    id: 'created',
    label: 'Created',
    qualities: {
      dice: [12, 6],
      categories: ['Physical'],
      list: ['Alertness', 'Science', 'Technology']
    },    
    description: 'Were you built to be the hero you are today? Perhaps. But it’s undeniable that you were created by someone or something. As a constructed being, you don’t have the same experiences or expectations as similar organic creatures, but you still feel drawn to the role of hero.',
    powerSource: [10, 10, 6],
    principle: 'Esoteric'
  }
]