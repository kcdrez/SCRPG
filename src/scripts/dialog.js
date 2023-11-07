import { ref } from "vue";
import { createConfirmDialog } from "vuejs-confirm-dialog";

import ConfirmDialog from "components/dialogs/confirmDialog.vue";
import ModifyActorDialog from "components/dialogs/modifierDialog.vue";
import CreateActorDialog from "components/dialogs/createActorDialog.vue";
import BoostChartDialog from "components/dialogs/boostChartDialog.vue";
import OvercomeChartDialog from "components/dialogs/overcomeChartDialog.vue";

const dialog = {
  confirm: ({
    title,
    body,
    okText,
    cancelText,
    onConfirmDialog = () => {},
    onCancelDialog = () => {},
  }) => {
    const showDialog = ref(true);
    const { reveal, onConfirm, onCancel } = createConfirmDialog(ConfirmDialog, {
      show: showDialog,
      title,
      body,
      okText,
      cancelText,
    });

    onConfirm(() => {
      showDialog.value = false;
      onConfirmDialog();
    });

    onCancel(() => {
      showDialog.value = false;
      onCancelDialog();
    });

    reveal();
  },
  modifyActor: ({ type, target }) => {
    const showDialog = ref(true);
    const { reveal, onConfirm, onCancel } = createConfirmDialog(
      ModifyActorDialog,
      {
        show: showDialog,
        type,
        target,
      }
    );

    onConfirm(() => {
      showDialog.value = false;
    });

    onCancel(() => {
      showDialog.value = false;
    });

    reveal();
  },
  createActor: ({ type, ownerId }) => {
    const showDialog = ref(true);
    const { reveal, onConfirm, onCancel } = createConfirmDialog(
      CreateActorDialog,
      {
        show: showDialog,
        type,
        ownerId,
      }
    );

    onConfirm(() => {
      showDialog.value = false;
    });

    onCancel(() => {
      showDialog.value = false;
    });

    reveal();
  },
  boostChart: () => {
    const showDialog = ref(true);
    const { reveal, onCancel } = createConfirmDialog(BoostChartDialog, {
      show: showDialog,
    });

    onCancel(() => {
      showDialog.value = false;
    });

    reveal();
  },
  overcomeChart: () => {
    const showDialog = ref(true);
    const { reveal, onCancel } = createConfirmDialog(OvercomeChartDialog, {
      show: showDialog,
    });

    onCancel(() => {
      showDialog.value = false;
    });

    reveal();
  },
};

export default dialog;
