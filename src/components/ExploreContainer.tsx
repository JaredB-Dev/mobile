import './ExploreContainer.css';
import React from 'react';
import { IonAlert, IonButton } from '@ionic/react';

interface ContainerProps {
  name: string;
}

const ExploreContainer: React.FC<ContainerProps> = ({ name }) => {
  const alertId = `present-alert-${name}`;
  
  return (
    <div className="container">
      <IonButton id={alertId}>{name}</IonButton>
      <IonAlert
        trigger={alertId}
        header="A Short Title Is Best"
        subHeader="A Sub Header Is Optional"
        message="A message should be a short, complete sentence."
        buttons={['Action']}
      ></IonAlert>
    </div>
  );
};

export default ExploreContainer;
