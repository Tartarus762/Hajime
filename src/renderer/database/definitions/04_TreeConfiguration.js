import Sequelize from 'sequelize'
import timestamp_definition from './timestamp'

export default {
    name: "TreeConfiguration",
    getDefinition: is_migration => {
        return {
            id: {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            competition_formula_id: {
                type: Sequelize.INTEGER(10).UNSIGNED,
                allowNull: false,
                references: {
                    model: 'CompetitionFormula',
                    key: 'id'
                },
                unique: true
            },
            repulse_favorite: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: 0
            },
            repulse_club: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: 0
            },
            third_place: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: 0
            },
            locked: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: 0
            },
            ...is_migration && timestamp_definition
        }
    },
    getAssociation: Model => model_list => {
        Model.belongsTo(model_list.CompetitionFormula, { as: "competition_formula", foreignKey: "competition_formula_id" })
    }
}