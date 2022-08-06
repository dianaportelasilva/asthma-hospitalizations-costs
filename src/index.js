import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min';
import './style.scss';
import { onDomReady } from 'cantil';
import initRegressionModels from './tabs/regression-models';
import initAssociationRules from './tabs/association-rules';
// import initDecisionTrees from './tabs/decision-trees';

onDomReady().then(async () => {
  Promise.all([
    // Regression Tab
    initRegressionModels(),

    // Regression Tab
    initAssociationRules(),

    // Regression Tab
    // initDecisionTrees(),
  ])
    .then(() => {
      // Hide loading
      queryAll('.tab-pane.d-none').forEach(e => e.classList.remove('d-none'));
      query('.loading').classList.add('d-none');
    });
});
