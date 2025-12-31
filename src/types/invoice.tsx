export type Facture = {
  numeroFacture: string | null;
  totalExpedition: number;
  dateFacture: string;
  dateExpedition: string;
  expediteur: informationExpediteur;
  destinataire: informationDestinataire;
  infoColis: infoColis[];
  detailFacture: detailFacture;
  totalPayer: number;
};

export type infoFormulaire = {
  expediteur: informationExpediteur;
  destinataire: informationDestinataire;
  infoColis: {
    descriptionColis: string;
    poidsColis: number;
  }[];
  detailFacture: detailFacture;
};

export type informationExpediteur = {
  nomExpediteur: string;
  telephoneExpediteur: string;
};

export type informationDestinataire = {
  nomDestinataire: string;
  telephoneDestinataire: string;
  villeDestinataire: string;
};

export type infoColis = {
  descriptionColis: string;
  poidsColis: number;
  prixUnitaire: number;
  prixColis: number;
};

export type detailFacture = {
  valeurColis: number;
  assurance: string;
  montantAssurance?: number;
  modePaiement: string;
};
