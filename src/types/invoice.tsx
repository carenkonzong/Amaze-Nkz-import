export type Facture = {
  numeroFacture: string;
  expediteur: informationExpediteur;
  destinataire: informationDestinataire;
  descriptionColis: descriptionColis;
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

export type descriptionColis = {
  poidsColis: string;
  prixColis: string;
};

export type detailFacture = {
  valeurColis: string;
  assurance: boolean;
  modePaiement: string;
};
