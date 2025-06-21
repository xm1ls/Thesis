// import { create } from "zustand";

// export const useNavbarStore = create((set) => ({
//   actionGroups: [],

//   setActions: (key, actions, order = 0) =>
//     set((state) => {
//       const others = state.actionGroups.filter((g) => g.key !== key);
//       return {
//         actionGroups: [...others, { key, actions, order }],
//       };
//     }),

//   removeActions: (key) =>
//     set((state) => ({
//       actionGroups: state.actionGroups.filter((g) => g.key !== key),
//     })),
// }));

import { create } from "zustand";

export const useNavbarStore = create((set, get) => ({
  actionGroups: {},

  setActions: (groupId, actions, priority = 10) => {
    set((state) => ({
      actionGroups: {
        ...state.actionGroups,
        [groupId]: {
          actions,
          priority,
          key: groupId,
        },
      },
    }));
  },

  removeActions: (groupId) => {
    set((state) => {
      const updated = { ...state.actionGroups };
      delete updated[groupId];
      return { actionGroups: updated };
    });
  },
}));

